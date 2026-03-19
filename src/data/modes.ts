export interface ZellijMode {
    name: string;
    description: string;
}

export const modes: ZellijMode[] = [
    {
        name: 'normal',
        description: 'The default mode. Input goes directly to the focused terminal pane.',
    },
    {
        name: 'locked',
        description: 'All keybindings are disabled except the one to switch back. Useful when running apps that conflict with Zellij keybindings.',
    },
    {
        name: 'resize',
        description: 'Mode for resizing the focused pane using directional keys.',
    },
    {
        name: 'pane',
        description: 'Mode for pane management: creating, closing, and navigating between panes.',
    },
    {
        name: 'tab',
        description: 'Mode for tab management: creating, closing, renaming, and navigating between tabs.',
    },
    {
        name: 'scroll',
        description: 'Mode for scrolling through the pane buffer.',
    },
    {
        name: 'enter_search',
        description: 'Mode for entering a search term in the scroll buffer.',
    },
    {
        name: 'search',
        description: 'Mode for navigating between search results in the scroll buffer.',
    },
    {
        name: 'rename_tab',
        description: 'Mode for typing a new name for the current tab.',
    },
    {
        name: 'rename_pane',
        description: 'Mode for typing a new name for the current pane.',
    },
    {
        name: 'session',
        description: 'Mode for session management: detaching, dumping layout, etc.',
    },
    {
        name: 'move',
        description: 'Mode for moving the focused pane within the layout.',
    },
    {
        name: 'prompt',
        description: 'Mode for Zellij prompts (e.g., confirmation dialogs).',
    },
    {
        name: 'tmux',
        description: 'Mode that emulates tmux-style keybindings for users transitioning from tmux.',
    },
];

export const modeNames: string[] = modes.map(m => m.name);

export const keybindBlocks = [
    { name: 'normal', description: 'Keybindings active in normal mode.' },
    { name: 'locked', description: 'Keybindings active in locked mode.' },
    { name: 'resize', description: 'Keybindings active in resize mode.' },
    { name: 'pane', description: 'Keybindings active in pane mode.' },
    { name: 'tab', description: 'Keybindings active in tab mode.' },
    { name: 'scroll', description: 'Keybindings active in scroll mode.' },
    { name: 'search', description: 'Keybindings active in search mode.' },
    { name: 'enter_search', description: 'Keybindings active in enter_search mode.' },
    { name: 'rename_tab', description: 'Keybindings active in rename_tab mode.' },
    { name: 'rename_pane', description: 'Keybindings active in rename_pane mode.' },
    { name: 'session', description: 'Keybindings active in session mode.' },
    { name: 'move', description: 'Keybindings active in move mode.' },
    { name: 'tmux', description: 'Keybindings active in tmux mode.' },
    { name: 'shared', description: 'Keybindings shared across ALL modes.' },
    { name: 'shared_except', description: 'Keybindings shared across all modes EXCEPT the listed ones. Usage: shared_except "normal" "locked" { ... }' },
    { name: 'shared_among', description: 'Keybindings shared ONLY among the listed modes. Usage: shared_among "resize" "move" { ... }' },
];

export function getModeByName(name: string): ZellijMode | undefined {
    return modes.find(m => m.name === name);
}
