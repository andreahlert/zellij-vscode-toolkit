import * as assert from 'assert';

// Basic smoke tests for the extension
// These run in a Node.js context, not a VS Code extension host

function testDataImports() {
    const { configOptions, getAllOptionNames } = require('../data/options');
    assert.ok(configOptions.length > 0, 'Should have config options');
    assert.ok(getAllOptionNames().includes('simplified_ui'), 'Should include simplified_ui');
    assert.ok(getAllOptionNames().includes('default_shell'), 'Should include default_shell');
    assert.ok(getAllOptionNames().includes('theme'), 'Should include theme');
    console.log(`  [PASS] ${configOptions.length} config options loaded`);
}

function testActionsData() {
    const { actions, getAllActionNames } = require('../data/actions');
    assert.ok(actions.length > 0, 'Should have actions');
    assert.ok(getAllActionNames().includes('Quit'), 'Should include Quit');
    assert.ok(getAllActionNames().includes('SwitchToMode'), 'Should include SwitchToMode');
    assert.ok(getAllActionNames().includes('NewPane'), 'Should include NewPane');
    console.log(`  [PASS] ${actions.length} actions loaded`);
}

function testModesData() {
    const { modes, modeNames } = require('../data/modes');
    assert.ok(modes.length > 0, 'Should have modes');
    assert.ok(modeNames.includes('normal'), 'Should include normal');
    assert.ok(modeNames.includes('locked'), 'Should include locked');
    console.log(`  [PASS] ${modes.length} modes loaded`);
}

function testLayoutData() {
    const { layoutElements, getAllLayoutElementNames } = require('../data/layoutElements');
    assert.ok(layoutElements.length > 0, 'Should have layout elements');
    assert.ok(getAllLayoutElementNames().includes('pane'), 'Should include pane');
    assert.ok(getAllLayoutElementNames().includes('layout'), 'Should include layout');
    assert.ok(getAllLayoutElementNames().includes('tab'), 'Should include tab');
    console.log(`  [PASS] ${layoutElements.length} layout elements loaded`);
}

function testPluginsData() {
    const { builtinPlugins, getAllPluginLocations } = require('../data/builtinPlugins');
    assert.ok(builtinPlugins.length > 0, 'Should have built-in plugins');
    assert.ok(getAllPluginLocations().includes('zellij:tab-bar'), 'Should include tab-bar');
    assert.ok(getAllPluginLocations().includes('zellij:status-bar'), 'Should include status-bar');
    console.log(`  [PASS] ${builtinPlugins.length} built-in plugins loaded`);
}

function runTests() {
    console.log('\nZellij Config Extension Tests\n');

    const tests = [
        ['Config options data', testDataImports],
        ['Actions data', testActionsData],
        ['Modes data', testModesData],
        ['Layout elements data', testLayoutData],
        ['Plugins data', testPluginsData],
    ] as const;

    let passed = 0;
    let failed = 0;

    for (const [name, fn] of tests) {
        try {
            console.log(`Running: ${name}`);
            (fn as () => void)();
            passed++;
        } catch (err) {
            console.error(`  [FAIL] ${name}: ${err}`);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
