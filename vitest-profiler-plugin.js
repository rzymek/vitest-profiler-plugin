import {afterAll, afterEach, beforeEach, beforeAll} from 'vitest';
import * as fs from "node:fs/promises";
import * as path from "node:path";
import v8Profiler from "v8-profiler-next";

const profileResultsDir = "test-profile";
v8Profiler.setGenerateType(1 /*1=tree, 0=flat*/);

const sanitizeSegment = (segment) =>
    segment.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');

function suitePath(suite, arr = []) {
    if (suite) {
        arr.unshift(suite.name);
        return suitePath(suite.suite, arr)
    } else {
        return arr;
    }
}

function testContext(context) {
    const {name, suite, file} = context.task;
    const filename = file.name;
    const testPath = [...suitePath(suite), name];
    const testName = testPath.join(" > ");
    return {
        testName,
        testPath,
        filename,
        fullname: `${filename}: ${testName}`
    }
}


function outputDir(context) {
    const c = testContext(context)
    return path.join(profileResultsDir, c.filename);
}

beforeEach(async (context) => {
    v8Profiler.startProfiling(testContext(context).fullname, true);
});

async function saveProfile(profile, outputFilename) {
    const result = await new Promise((resolve, reject) => {
        profile.export((error, result) =>
            error ? reject(error) : resolve(result)
        )
    });
    await fs.writeFile(outputFilename, result);
    profile.delete();
}

afterEach(async (context) => {
    const testPathContext = testContext(context);
    const testPath = testPathContext.testPath.map(sanitizeSegment);
    const name = testPath.pop();
    const profileOutputDir = path.join(outputDir(context), ...testPath);
    await fs.mkdir(profileOutputDir, {recursive: true});
    const outputFilename = path.format({
        dir: profileOutputDir,
        name,
        ext: 'cpuprofile'
    });
    const profile = v8Profiler.stopProfiling(testContext(context).fullname);
    await saveProfile(profile, outputFilename);
});

const allTestsProfileName = 'vitest-profiler';
beforeAll(() => {
    v8Profiler.startProfiling(allTestsProfileName, true);
})

afterAll(async () => {
    const outputFilename = path.format({
        dir: profileResultsDir,
        name: 'all-tests',
        ext: 'cpuprofile'
    });
    const profile = v8Profiler.stopProfiling(allTestsProfileName);
    await saveProfile(profile, outputFilename)

    console.log(`Profile written in ./${profileResultsDir}
To examine the profile:
    Navigate to chrome://inspect
    Click Open dedicated DevTools for Node
    Select the Performance tab
    Import your .cpuprofile file
`)
})


