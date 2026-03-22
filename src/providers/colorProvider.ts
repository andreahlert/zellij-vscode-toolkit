import * as vscode from 'vscode';
import { removeStrings } from '../utils/kdlParser';
import { logError } from '../extension';

export class ZellijColorProvider implements vscode.DocumentColorProvider {
    provideDocumentColors(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken
    ): vscode.ColorInformation[] {
        try {
            return this.doProvideDocumentColors(document);
        } catch (err) {
            logError('Color provider error', err);
            return [];
        }
    }

    private doProvideDocumentColors(document: vscode.TextDocument): vscode.ColorInformation[] {
        const config = vscode.workspace.getConfiguration('zellijConfig');
        if (!config.get('enableColorDecorators', true)) {
            return [];
        }

        const colors: vscode.ColorInformation[] = [];

        // Track if we're inside a themes block
        let inThemes = false;
        let braceDepth = 0;
        let themesDepth = 0;
        let inBlockComment = false;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const trimmed = line.text.trim();

            // Track multi-line block comments (strip strings to avoid false matches)
            const commentCheck = removeStrings(trimmed);
            if (inBlockComment) {
                if (commentCheck.includes('*/')) {
                    inBlockComment = false;
                }
                continue;
            }
            if (commentCheck.startsWith('//')) continue;
            if (commentCheck.includes('/*')) {
                if (!commentCheck.includes('*/')) {
                    inBlockComment = true;
                }
                continue;
            }

            // Track themes block
            if (/^\s*themes\s*\{/.test(line.text)) {
                inThemes = true;
                themesDepth = braceDepth;
            }

            const strippedLine = removeStrings(trimmed);
            const opens = (strippedLine.match(/\{/g) || []).length;
            const closes = (strippedLine.match(/\}/g) || []).length;
            braceDepth += opens - closes;

            if (inThemes && braceDepth <= themesDepth) {
                inThemes = false;
            }

            // Find hex colors in theme definitions
            if (inThemes) {
                const colorPattern = /"(#[0-9a-fA-F]{6})"/g;
                let match;

                while ((match = colorPattern.exec(line.text)) !== null) {
                    const hex = match[1];
                    const color = this.hexToColor(hex);
                    if (color) {
                        const startPos = new vscode.Position(i, match.index + 1);
                        const endPos = new vscode.Position(i, match.index + 1 + hex.length);
                        const range = new vscode.Range(startPos, endPos);
                        colors.push(new vscode.ColorInformation(range, color));
                    }
                }
            }
        }

        return colors;
    }

    provideColorPresentations(
        color: vscode.Color,
        context: { document: vscode.TextDocument; range: vscode.Range },
        _token: vscode.CancellationToken
    ): vscode.ColorPresentation[] {
        try {
            const hex = this.colorToHex(color);
            const presentation = new vscode.ColorPresentation(hex);
            presentation.textEdit = new vscode.TextEdit(context.range, hex);
            return [presentation];
        } catch (err) {
            logError('Color presentation error', err);
            return [];
        }
    }

    private hexToColor(hex: string): vscode.Color | null {
        const match = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
        if (!match) return null;

        const r = parseInt(match[1], 16) / 255;
        const g = parseInt(match[2], 16) / 255;
        const b = parseInt(match[3], 16) / 255;

        return new vscode.Color(r, g, b, 1);
    }

    private colorToHex(color: vscode.Color): string {
        const r = Math.round(color.red * 255).toString(16).padStart(2, '0');
        const g = Math.round(color.green * 255).toString(16).padStart(2, '0');
        const b = Math.round(color.blue * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
}
