import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Zellij Completion Provider', () => {
    const fixturesPath = path.resolve(__dirname, '../../../test-fixtures');

    suiteSetup(async () => {
        // Open config file to activate extension
        const configUri = vscode.Uri.file(path.join(fixturesPath, 'config.kdl'));
        const doc = await vscode.workspace.openTextDocument(configUri);
        await vscode.languages.setTextDocumentLanguage(doc, 'zellij-kdl');
        await vscode.window.showTextDocument(doc);
        await sleep(2000);
    });

    async function getCompletionsAt(content: string, line: number, character: number): Promise<vscode.CompletionList> {
        const doc = await vscode.workspace.openTextDocument({ content, language: 'zellij-kdl' });
        await vscode.window.showTextDocument(doc);
        await sleep(500);

        const position = new vscode.Position(line, character);
        return await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            doc.uri,
            position
        );
    }

    function getLabels(completions: vscode.CompletionList): string[] {
        return completions.items.map(i => typeof i.label === 'string' ? i.label : i.label.label);
    }

    test('provides top-level config option completions', async () => {
        const completions = await getCompletionsAt('', 0, 0);
        assert.ok(completions.items.length > 0, 'Should provide completions');

        const labels = getLabels(completions);
        assert.ok(labels.includes('simplified_ui'), 'Should include simplified_ui');
        assert.ok(labels.includes('default_shell'), 'Should include default_shell');
        assert.ok(labels.includes('theme'), 'Should include theme');
        assert.ok(labels.includes('mouse_mode'), 'Should include mouse_mode');
        assert.ok(labels.includes('scroll_buffer_size'), 'Should include scroll_buffer_size');
    });

    test('provides top-level block completions', async () => {
        const completions = await getCompletionsAt('', 0, 0);
        const labels = getLabels(completions);
        assert.ok(labels.includes('keybinds'), 'Should include keybinds block');
        assert.ok(labels.includes('themes'), 'Should include themes block');
        assert.ok(labels.includes('plugins'), 'Should include plugins block');
        assert.ok(labels.includes('ui'), 'Should include ui block');
    });

    test('provides mode completions inside keybinds', async () => {
        const completions = await getCompletionsAt('keybinds {\n    \n}', 1, 4);
        assert.ok(completions.items.length > 0, 'Should provide mode completions');

        const labels = getLabels(completions);
        assert.ok(labels.includes('normal'), 'Should include normal mode');
        assert.ok(labels.includes('locked'), 'Should include locked mode');
        assert.ok(labels.includes('tmux'), 'Should include tmux mode');
        assert.ok(labels.includes('shared'), 'Should include shared block');
        assert.ok(labels.includes('shared_except'), 'Should include shared_except');
    });

    test('provides bind completion inside mode block', async () => {
        const completions = await getCompletionsAt('keybinds {\n    normal {\n        \n    }\n}', 2, 8);
        const labels = getLabels(completions);
        assert.ok(labels.includes('bind'), 'Should include bind');
        assert.ok(labels.includes('unbind'), 'Should include unbind');
    });

    test('provides action completions inside bind block', async () => {
        const content = 'keybinds {\n    normal {\n        bind "Ctrl a" {\n            \n        }\n    }\n}';
        const completions = await getCompletionsAt(content, 3, 12);
        assert.ok(completions.items.length > 0, 'Should provide action completions');

        const labels = getLabels(completions);
        assert.ok(labels.includes('SwitchToMode'), 'Should include SwitchToMode');
        assert.ok(labels.includes('NewPane'), 'Should include NewPane');
        assert.ok(labels.includes('NewTab'), 'Should include NewTab');
        assert.ok(labels.includes('MoveFocus'), 'Should include MoveFocus');
        assert.ok(labels.includes('Quit'), 'Should include Quit');
        assert.ok(labels.includes('Detach'), 'Should include Detach');
        assert.ok(labels.includes('CloseFocus'), 'Should include CloseFocus');
    });

    test('provides theme color completions inside theme block', async () => {
        const completions = await getCompletionsAt('themes {\n    mytheme {\n        \n    }\n}', 2, 8);
        assert.ok(completions.items.length > 0, 'Should provide color completions');

        const labels = getLabels(completions);
        assert.ok(labels.includes('fg'), 'Should include fg');
        assert.ok(labels.includes('bg'), 'Should include bg');
        assert.ok(labels.includes('red'), 'Should include red');
        assert.ok(labels.includes('green'), 'Should include green');
        assert.ok(labels.includes('orange'), 'Should include orange');
    });

    test('provides plugin completions inside plugins block', async () => {
        const completions = await getCompletionsAt('plugins {\n    \n}', 1, 4);
        assert.ok(completions.items.length > 0, 'Should provide plugin completions');

        const labels = getLabels(completions);
        assert.ok(labels.some(l => l.includes('tab-bar')), 'Should include tab-bar');
        assert.ok(labels.some(l => l.includes('status-bar')), 'Should include status-bar');
    });

    test('provides completions with documentation', async () => {
        const completions = await getCompletionsAt('', 0, 0);
        const themeItem = completions.items.find(i => {
            const label = typeof i.label === 'string' ? i.label : i.label.label;
            return label === 'theme';
        });
        assert.ok(themeItem, 'Should find theme completion');
        assert.ok(themeItem!.documentation, 'Should have documentation');
    });

    test('provides snippet insert text for boolean options', async () => {
        const completions = await getCompletionsAt('', 0, 0);
        const mouseMode = completions.items.find(i => {
            const label = typeof i.label === 'string' ? i.label : i.label.label;
            return label === 'mouse_mode';
        });
        assert.ok(mouseMode, 'Should find mouse_mode');
        assert.ok(mouseMode!.insertText, 'Should have insert text');
        const insertText = mouseMode!.insertText instanceof vscode.SnippetString
            ? mouseMode!.insertText.value
            : String(mouseMode!.insertText);
        assert.ok(insertText.includes('true') || insertText.includes('false'), 'Boolean option should offer true/false');
    });

    test('provides clear-defaults inside keybinds', async () => {
        const completions = await getCompletionsAt('keybinds {\n    \n}', 1, 4);
        const labels = getLabels(completions);
        assert.ok(labels.includes('clear-defaults'), 'Should include clear-defaults');
    });

    test('provides pane_frames inside ui block', async () => {
        const completions = await getCompletionsAt('ui {\n    \n}', 1, 4);
        const labels = getLabels(completions);
        assert.ok(labels.includes('pane_frames'), 'Should include pane_frames');
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
