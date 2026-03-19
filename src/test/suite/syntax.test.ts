import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Zellij Language Registration', () => {
    test('recognizes zellij-kdl language', async () => {
        const doc = await vscode.workspace.openTextDocument({ content: 'simplified_ui true', language: 'zellij-kdl' });
        assert.strictEqual(doc.languageId, 'zellij-kdl', 'Should recognize zellij-kdl language');
    });

    test('zellij-kdl is a registered language', async () => {
        const languages = await vscode.languages.getLanguages();
        assert.ok(languages.includes('zellij-kdl'), 'zellij-kdl should be a registered language');
    });

    test('extension activates on zellij-kdl document', async () => {
        const doc = await vscode.workspace.openTextDocument({ content: 'theme "dracula"', language: 'zellij-kdl' });
        await vscode.window.showTextDocument(doc);
        await sleep(1000);

        // If completions work, the extension has activated
        const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            doc.uri,
            new vscode.Position(0, 0)
        );
        assert.ok(completions.items.length > 0, 'Extension should be active and providing completions');
    });

    test('registers setAsZellijConfig command', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('zellij-config.setAsZellijConfig'), 'Should register setAsZellijConfig command');
    });

    test('registers openDocs command', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('zellij-config.openDocs'), 'Should register openDocs command');
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
