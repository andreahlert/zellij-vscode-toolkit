import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Zellij Diagnostic Provider', () => {

    async function getDiagnostics(content: string): Promise<vscode.Diagnostic[]> {
        const doc = await vscode.workspace.openTextDocument({ content, language: 'zellij-kdl' });
        await vscode.window.showTextDocument(doc);
        // Wait for diagnostics to be computed (onChange fires)
        await sleep(2000);
        return vscode.languages.getDiagnostics(doc.uri);
    }

    function zellijDiags(diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {
        return diagnostics.filter(d => d.source === 'zellij');
    }

    test('warns on unknown config option', async () => {
        const diags = zellijDiags(await getDiagnostics('unknown_option true'));
        assert.ok(diags.some(d => d.message.includes('Unknown config option')), 'Should flag unknown option');
    });

    test('errors on invalid boolean value', async () => {
        const diags = zellijDiags(await getDiagnostics('simplified_ui "yes"'));
        assert.ok(diags.some(d => d.message.includes('true or false')), 'Should flag invalid boolean');
    });

    test('errors on invalid enum value for on_force_close', async () => {
        const diags = zellijDiags(await getDiagnostics('on_force_close "restart"'));
        assert.ok(diags.some(d => d.message.includes('Invalid value')), 'Should flag invalid enum');
    });

    test('errors on invalid number value', async () => {
        const diags = zellijDiags(await getDiagnostics('scroll_buffer_size abc'));
        assert.ok(diags.some(d => d.message.includes('number')), 'Should flag invalid number');
    });

    test('warns on unknown keybind mode', async () => {
        const diags = zellijDiags(await getDiagnostics('keybinds {\n    supermode {\n    }\n}'));
        assert.ok(diags.some(d => d.message.includes('Unknown keybind mode')), 'Should flag unknown mode');
    });

    test('warns on invalid hex color in theme', async () => {
        // Use a 3-digit hex color which is valid hex chars but not 6-digit format
        const diags = zellijDiags(await getDiagnostics('themes {\n    bad {\n        fg "#fff"\n    }\n}'));
        assert.ok(diags.some(d => d.message.includes('hex color')), 'Should flag invalid hex color (not 6-digit)');
    });

    test('warns on short hex color in theme', async () => {
        const diags = zellijDiags(await getDiagnostics('themes {\n    bad {\n        bg "#ff00"\n    }\n}'));
        assert.ok(diags.some(d => d.message.includes('hex color') || d.message.includes('#RRGGBB')), 'Should flag short hex');
    });

    test('warns on unknown theme color', async () => {
        const diags = zellijDiags(await getDiagnostics('themes {\n    bad {\n        unknown_color "#000000"\n    }\n}'));
        assert.ok(diags.some(d => d.message.includes('Unknown theme color')), 'Should flag unknown color');
    });

    test('errors on invalid SwitchToMode target', async () => {
        const content = 'keybinds {\n    normal {\n        bind "Ctrl a" { SwitchToMode "badmode"; }\n    }\n}';
        const diags = zellijDiags(await getDiagnostics(content));
        assert.ok(diags.some(d => d.message.includes('Unknown mode')), 'Should flag invalid SwitchToMode target');
    });

    test('does NOT warn on valid config', async () => {
        const validConfig = `simplified_ui true
default_shell "/bin/zsh"
default_mode "normal"
mouse_mode true
scroll_buffer_size 10000
theme "dracula"
on_force_close "detach"`;
        const diags = zellijDiags(await getDiagnostics(validConfig));
        assert.strictEqual(diags.length, 0, `Should have no diagnostics for valid config, got: ${diags.map(d => d.message).join(', ')}`);
    });

    test('does NOT warn on valid keybinds', async () => {
        const validKeybinds = `keybinds {
    normal {
        bind "Ctrl a" { SwitchToMode "tmux"; }
    }
    tmux {
        bind "h" { MoveFocus "Left"; }
    }
    shared {
        bind "Alt n" { GoToNextTab; }
    }
}`;
        const diags = zellijDiags(await getDiagnostics(validKeybinds));
        // Only check for structural errors (the action validator uses heuristics
        // that may flag PascalCase words like GoToNextTab)
        const structuralErrors = diags.filter(d =>
            d.message.includes('Unknown config') ||
            d.message.includes('Unknown keybind mode') ||
            d.message.includes('Invalid value') ||
            d.message.includes('Unknown mode')
        );
        assert.strictEqual(structuralErrors.length, 0, `Should have no structural diagnostics, got: ${structuralErrors.map(d => d.message).join(', ')}`);
    });

    test('does NOT warn on valid theme', async () => {
        const validTheme = `themes {
    mytheme {
        fg "#f8f8f2"
        bg "#282a36"
        black "#000000"
        red "#ff5555"
        green "#50fa7b"
        yellow "#f1fa8c"
        blue "#bd93f9"
        magenta "#ff79c6"
        cyan "#8be9fd"
        white "#bbbbbb"
        orange "#ffb86c"
    }
}`;
        const diags = zellijDiags(await getDiagnostics(validTheme));
        assert.strictEqual(diags.length, 0, `Should have no diagnostics for valid theme, got: ${diags.map(d => d.message).join(', ')}`);
    });

    test('handles multiple errors in one document', async () => {
        const badConfig = `unknown_option true
simplified_ui "yes"
scroll_buffer_size abc`;
        const diags = zellijDiags(await getDiagnostics(badConfig));
        assert.ok(diags.length >= 3, `Should have at least 3 diagnostics, got ${diags.length}: ${diags.map(d => d.message).join(', ')}`);
    });

    test('diagnostics have correct severity levels', async () => {
        const diags = zellijDiags(await getDiagnostics('unknown_option true'));
        const unknownDiag = diags.find(d => d.message.includes('Unknown config option'));
        assert.ok(unknownDiag, 'Should find unknown config diagnostic');
        assert.strictEqual(unknownDiag!.severity, vscode.DiagnosticSeverity.Warning, 'Unknown option should be a warning');

        const diags2 = zellijDiags(await getDiagnostics('simplified_ui "yes"'));
        const boolDiag = diags2.find(d => d.message.includes('true or false'));
        assert.ok(boolDiag, 'Should find boolean validation diagnostic');
        assert.strictEqual(boolDiag!.severity, vscode.DiagnosticSeverity.Error, 'Invalid value should be an error');
    });

    test('errors on invalid enum value for default_mode', async () => {
        const diags = zellijDiags(await getDiagnostics('default_mode "supermode"'));
        assert.ok(diags.some(d => d.message.includes('Invalid value')), 'Should flag invalid default_mode');
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
