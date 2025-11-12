import {afterAll, afterEach, beforeEach} from 'vitest';
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as v8Profiler from "v8-profiler-next";

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
    profile.export((error, result) => {
        fs.writeFile(outputFilename, result).then(() => {
            profile.delete()
        });
    });
});

afterAll(() => {
    console.log(`Profile written in ./${profileResultsDir}
To examine the profile:
    Navigate to chrome://inspect
    Click Open dedicated DevTools for Node
    Select the Performance tab
    Import your .cpuprofile file
`)
})


