import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Determines if a document is likely a Zellij configuration or layout file.
 * Uses multiple heuristics to detect Zellij files without interfering with
 * other KDL-based configurations.
 */
export function isZellijFile(document: vscode.TextDocument): boolean {
    // Already set to zellij-kdl language
    if (document.languageId === 'zellij-kdl') {
        return true;
    }

    // Only consider KDL files
    if (!document.fileName.endsWith('.kdl')) {
        return false;
    }

    const filePath = document.fileName;
    const fileName = path.basename(filePath);

    // Check if file is in a zellij config directory
    if (isInZellijDirectory(filePath)) {
        return true;
    }

    // Check for zellij marker comment at the top of the file
    if (hasZellijMarker(document)) {
        return true;
    }

    // Check if file content looks like zellij config
    if (hasZellijContent(document)) {
        return true;
    }

    return false;
}

/**
 * Checks if the file is in a directory associated with Zellij.
 */
function isInZellijDirectory(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, '/');

    // ~/.config/zellij/
    if (normalized.includes('.config/zellij/')) {
        return true;
    }

    // Any path containing 'zellij' as a directory component
    const parts = normalized.split('/');
    for (const part of parts) {
        if (part.toLowerCase() === 'zellij') {
            return true;
        }
    }

    return false;
}

/**
 * Checks if the document starts with a Zellij marker comment.
 */
function hasZellijMarker(document: vscode.TextDocument): boolean {
    const maxLines = Math.min(5, document.lineCount);
    for (let i = 0; i < maxLines; i++) {
        const line = document.lineAt(i).text.trim().toLowerCase();
        if (line.includes('// zellij') || line.includes('/* zellij') || line.includes('// vim: ft=zellij')) {
            return true;
        }
    }
    return false;
}

/**
 * Heuristically checks if file content looks like Zellij configuration.
 * Looks for Zellij-specific top-level keywords.
 */
function hasZellijContent(document: vscode.TextDocument): boolean {
    const text = document.getText();
    const zellijKeywords = [
        'keybinds',
        'themes',
        'simplified_ui',
        'default_shell',
        'default_layout',
        'default_mode',
        'pane_frames',
        'mouse_mode',
        'copy_command',
        'on_force_close',
        'session_serialization',
        'scrollback_editor',
        'mirror_session',
        'copy_clipboard',
        'SwitchToMode',
        'ToggleFloatingPanes',
        'swap_tiled_layout',
        'swap_floating_layout',
        'default_tab_template',
        'pane_template',
        'tab_template',
    ];

    let matchCount = 0;
    for (const keyword of zellijKeywords) {
        if (text.includes(keyword)) {
            matchCount++;
        }
        // Two or more Zellij-specific keywords = very likely Zellij
        if (matchCount >= 2) {
            return true;
        }
    }

    // Check for layout pattern: layout { pane ... }
    if (/^\s*layout\s*\{/m.test(text) && /\bpane\b/.test(text)) {
        return true;
    }

    return false;
}

/**
 * Auto-detects Zellij KDL files and sets their language ID.
 */
export function setupAutoDetection(context: vscode.ExtensionContext): void {
    // Watch for opened text documents
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            trySetZellijLanguage(document);
        })
    );

    // Check already open documents
    for (const document of vscode.workspace.textDocuments) {
        trySetZellijLanguage(document);
    }
}

function trySetZellijLanguage(document: vscode.TextDocument): void {
    if (document.languageId === 'zellij-kdl') {
        return; // Already set
    }

    if (document.languageId !== 'kdl' && !document.fileName.endsWith('.kdl')) {
        return; // Not a KDL file
    }

    if (isZellijFile(document)) {
        vscode.languages.setTextDocumentLanguage(document, 'zellij-kdl');
    }
}

/**
 * Detects if the current file is a layout file (as opposed to a config file).
 * Layout files have a top-level `layout` node.
 */
export function isLayoutFile(document: vscode.TextDocument): boolean {
    const text = document.getText();
    return /^\s*layout\s*\{/m.test(text);
}
