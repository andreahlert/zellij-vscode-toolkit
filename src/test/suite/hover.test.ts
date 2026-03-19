import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Zellij Hover Provider', () => {
    async function getHovers(content: string, line: number, character: number): Promise<vscode.Hover[]> {
        const doc = await vscode.workspace.openTextDocument({ content, language: 'zellij-kdl' });
        await vscode.window.showTextDocument(doc);
        await sleep(1000);

        return await vscode.commands.executeCommand<vscode.Hover[]>(
            'vscode.executeHoverProvider',
            doc.uri,
            new vscode.Position(line, character)
        );
    }

    function getHoverText(hovers: vscode.Hover[]): string {
        return hovers.map(h => h.contents.map(c => typeof c === 'string' ? c : c.value).join('')).join('');
    }

    test('provides hover for simplified_ui', async () => {
        const hovers = await getHovers('simplified_ui true', 0, 5);
        assert.ok(hovers.length > 0, 'Should provide hover for simplified_ui');
        const content = getHoverText(hovers);
        assert.ok(content.length > 0, 'Hover should have content');
        assert.ok(content.includes('simplified_ui'), 'Should mention the option name');
    });

    test('provides hover for theme option', async () => {
        const hovers = await getHovers('theme "dracula"', 0, 2);
        assert.ok(hovers.length > 0, 'Should provide hover for theme');
        const content = getHoverText(hovers);
        assert.ok(content.includes('theme'), 'Should contain theme info');
    });

    test('provides hover for default_mode', async () => {
        const hovers = await getHovers('default_mode "normal"', 0, 5);
        assert.ok(hovers.length > 0, 'Should provide hover for default_mode');
        const content = getHoverText(hovers);
        assert.ok(content.includes('default_mode'), 'Should mention default_mode');
    });

    test('provides hover for scroll_buffer_size', async () => {
        const hovers = await getHovers('scroll_buffer_size 10000', 0, 5);
        assert.ok(hovers.length > 0, 'Should provide hover');
        const content = getHoverText(hovers);
        assert.ok(content.includes('scroll_buffer_size') || content.includes('scroll'), 'Should have meaningful content');
    });

    test('provides hover for keybinds block', async () => {
        const hovers = await getHovers('keybinds {\n}', 0, 4);
        assert.ok(hovers.length > 0, 'Should provide hover for keybinds block');
        const content = getHoverText(hovers);
        assert.ok(content.includes('keybind') || content.includes('Keybind'), 'Should mention keybindings');
    });

    test('provides hover for bind keyword', async () => {
        const content = 'keybinds {\n    normal {\n        bind "Ctrl a" { SwitchToMode "tmux"; }\n    }\n}';
        const hovers = await getHovers(content, 2, 10);
        assert.ok(hovers.length > 0, 'Should provide hover for bind');
        const text = getHoverText(hovers);
        assert.ok(text.includes('bind') || text.includes('Bind'), 'Should describe bind');
    });

    test('provides hover for SwitchToMode action', async () => {
        const content = 'keybinds {\n    normal {\n        bind "Ctrl a" { SwitchToMode "tmux"; }\n    }\n}';
        // SwitchToMode starts at character 24 on line 2
        const hovers = await getHovers(content, 2, 28);
        assert.ok(hovers.length > 0, 'Should provide hover for SwitchToMode action');
        const text = getHoverText(hovers);
        assert.ok(text.includes('SwitchToMode'), 'Should mention the action name');
    });

    test('provides hover for mode name in keybinds', async () => {
        const content = 'keybinds {\n    normal {\n    }\n}';
        const hovers = await getHovers(content, 1, 7);
        assert.ok(hovers.length > 0, 'Should provide hover for normal mode');
        const text = getHoverText(hovers);
        assert.ok(text.includes('normal') || text.includes('Normal'), 'Should describe the mode');
    });

    test('no hover inside comments', async () => {
        const hovers = await getHovers('// simplified_ui true', 0, 5);
        assert.strictEqual(hovers.length, 0, 'Should not provide hover inside comments');
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
