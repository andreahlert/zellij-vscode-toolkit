export interface BuiltinPlugin {
    name: string;
    location: string;
    description: string;
}

export const builtinPlugins: BuiltinPlugin[] = [
    {
        name: 'tab-bar',
        location: 'zellij:tab-bar',
        description: 'The default tab bar plugin, showing all open tabs at the top of the screen.',
    },
    {
        name: 'status-bar',
        location: 'zellij:status-bar',
        description: 'The default status bar plugin, showing keybinding hints and mode information at the bottom.',
    },
    {
        name: 'strider',
        location: 'zellij:strider',
        description: 'A file explorer sidebar plugin for navigating the filesystem.',
    },
    {
        name: 'compact-bar',
        location: 'zellij:compact-bar',
        description: 'A compact version of the tab bar and status bar combined into one line.',
    },
    {
        name: 'session-manager',
        location: 'zellij:session-manager',
        description: 'Plugin for managing Zellij sessions: listing, switching, creating, and deleting sessions.',
    },
    {
        name: 'welcome-screen',
        location: 'zellij:welcome-screen',
        description: 'The welcome screen plugin shown when Zellij starts without a layout.',
    },
    {
        name: 'filepicker',
        location: 'zellij:filepicker',
        description: 'A file picker plugin for selecting files from the filesystem.',
    },
    {
        name: 'plugin-manager',
        location: 'zellij:plugin-manager',
        description: 'Plugin for managing installed Zellij plugins.',
    },
    {
        name: 'about',
        location: 'zellij:about',
        description: 'Shows information about the current Zellij version and configuration.',
    },
];

export function getBuiltinPluginByName(name: string): BuiltinPlugin | undefined {
    return builtinPlugins.find(p => p.name === name);
}

export function getAllPluginLocations(): string[] {
    return builtinPlugins.map(p => p.location);
}
