export interface ConfigOption {
    name: string;
    type: 'boolean' | 'string' | 'number' | 'enum' | 'path';
    description: string;
    values?: string[];
    default?: string;
    example: string;
    docUrl: string;
    parent?: string;
}

const BASE_DOC_URL = 'https://zellij.dev/documentation/options';

export const configOptions: ConfigOption[] = [
    {
        name: 'simplified_ui',
        type: 'boolean',
        description: 'Removes the arrow fonts from the UI and uses ASCII characters instead. Useful for terminals that do not support arrow fonts.',
        values: ['true', 'false'],
        default: 'false',
        example: 'simplified_ui true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'default_shell',
        type: 'path',
        description: 'Sets the default shell to use in new panes. If not set, uses the system default shell.',
        example: 'default_shell "fish"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'default_cwd',
        type: 'path',
        description: 'Sets the default working directory for new panes. All panes will open in this directory unless overridden.',
        example: 'default_cwd "/home/user/projects"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'default_layout',
        type: 'string',
        description: 'Sets the default layout to use when starting a new session. Can be a layout name or a path to a layout file.',
        default: '"default"',
        example: 'default_layout "compact"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'default_mode',
        type: 'enum',
        description: 'Sets the mode Zellij starts in. Useful if you want Zellij to start in locked mode.',
        values: ['normal', 'locked', 'resize', 'pane', 'tab', 'scroll', 'enter_search', 'search', 'rename_tab', 'rename_pane', 'session', 'move', 'prompt'],
        default: '"normal"',
        example: 'default_mode "locked"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'mouse_mode',
        type: 'boolean',
        description: 'Enables or disables mouse support. When enabled, you can use the mouse to select panes, scroll, and resize.',
        values: ['true', 'false'],
        default: 'true',
        example: 'mouse_mode true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'scroll_buffer_size',
        type: 'number',
        description: 'Sets the maximum number of lines to keep in the scroll buffer for each pane.',
        default: '10000',
        example: 'scroll_buffer_size 50000',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'copy_command',
        type: 'string',
        description: 'Sets the command to use for copying text to the clipboard. Useful for systems where clipboard integration is not automatic.',
        example: 'copy_command "xclip -selection clipboard"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'copy_clipboard',
        type: 'enum',
        description: 'Sets which clipboard to use for copy operations.',
        values: ['system', 'primary'],
        default: '"system"',
        example: 'copy_clipboard "system"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'copy_on_select',
        type: 'boolean',
        description: 'Automatically copies text to clipboard when selected with the mouse.',
        values: ['true', 'false'],
        default: 'true',
        example: 'copy_on_select false',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'scrollback_editor',
        type: 'path',
        description: 'Sets the editor to use when editing the scrollback buffer. The file path will be passed as an argument.',
        example: 'scrollback_editor "/usr/bin/vim"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'mirror_session',
        type: 'boolean',
        description: 'When enabled, all sessions will mirror the layout of the first session. Useful for pair programming.',
        values: ['true', 'false'],
        default: 'false',
        example: 'mirror_session true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'on_force_close',
        type: 'enum',
        description: 'Sets the behavior when Zellij receives a force close signal (e.g., terminal is closed).',
        values: ['quit', 'detach'],
        default: '"detach"',
        example: 'on_force_close "quit"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'pane_frames',
        type: 'boolean',
        description: 'Enables or disables pane frames (borders around each pane).',
        values: ['true', 'false'],
        default: 'true',
        example: 'pane_frames false',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'auto_layout',
        type: 'boolean',
        description: 'When enabled, Zellij will automatically adjust the layout when panes are added or removed.',
        values: ['true', 'false'],
        default: 'true',
        example: 'auto_layout true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'session_serialization',
        type: 'boolean',
        description: 'Enables or disables session serialization. When enabled, sessions are saved to disk and can be restored.',
        values: ['true', 'false'],
        default: 'true',
        example: 'session_serialization true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'serialize_pane_viewport',
        type: 'boolean',
        description: 'When enabled, the visible viewport of each pane is also serialized with the session.',
        values: ['true', 'false'],
        default: 'false',
        example: 'serialize_pane_viewport true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'scrollback_lines_to_serialize',
        type: 'number',
        description: 'Sets the number of scrollback lines to serialize per pane. 0 means all lines are serialized.',
        default: '10000',
        example: 'scrollback_lines_to_serialize 5000',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'theme',
        type: 'string',
        description: 'Sets the color theme to use. Must match a theme name defined in the themes block or a built-in theme.',
        example: 'theme "dracula"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'styled_underlines',
        type: 'boolean',
        description: 'Enables styled (curly) underlines. Requires terminal support. Disable if underlines look wrong.',
        values: ['true', 'false'],
        default: 'true',
        example: 'styled_underlines false',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'serialization_interval',
        type: 'number',
        description: 'Sets the interval in seconds between automatic session serializations.',
        default: '60',
        example: 'serialization_interval 300',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'disable_session_metadata',
        type: 'boolean',
        description: 'Disables writing session metadata to disk. This can improve performance but disables session restore.',
        values: ['true', 'false'],
        default: 'false',
        example: 'disable_session_metadata true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'support_kitty_keyboard_protocol',
        type: 'boolean',
        description: 'Enables support for the Kitty keyboard protocol, allowing more key combinations to be captured.',
        values: ['true', 'false'],
        default: 'false',
        example: 'support_kitty_keyboard_protocol true',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'stacked_pane_resize_algorithm',
        type: 'enum',
        description: 'Sets the algorithm used when resizing stacked panes.',
        values: ['proportional', 'increase_then_decrease'],
        default: '"proportional"',
        example: 'stacked_pane_resize_algorithm "increase_then_decrease"',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'stacked_resize_up_start_count',
        type: 'number',
        description: 'Sets the number of panes to show above the focused pane in a stacked layout.',
        default: '1',
        example: 'stacked_resize_up_start_count 2',
        docUrl: BASE_DOC_URL,
    },
    {
        name: 'stacked_resize_down_start_count',
        type: 'number',
        description: 'Sets the number of panes to show below the focused pane in a stacked layout.',
        default: '1',
        example: 'stacked_resize_down_start_count 2',
        docUrl: BASE_DOC_URL,
    },
];

export const uiOptions: ConfigOption[] = [
    {
        name: 'rounded_corners',
        type: 'boolean',
        description: 'Enables rounded corners for pane frames.',
        values: ['true', 'false'],
        default: 'false',
        example: 'rounded_corners true',
        docUrl: BASE_DOC_URL,
        parent: 'ui.pane_frames',
    },
    {
        name: 'hide_session_name',
        type: 'boolean',
        description: 'Hides the session name from the status bar.',
        values: ['true', 'false'],
        default: 'false',
        example: 'hide_session_name true',
        docUrl: BASE_DOC_URL,
        parent: 'ui.pane_frames',
    },
];

export const themeColors = [
    { name: 'fg', description: 'Foreground color' },
    { name: 'bg', description: 'Background color' },
    { name: 'black', description: 'Black color (ANSI 0)' },
    { name: 'red', description: 'Red color (ANSI 1)' },
    { name: 'green', description: 'Green color (ANSI 2)' },
    { name: 'yellow', description: 'Yellow color (ANSI 3)' },
    { name: 'blue', description: 'Blue color (ANSI 4)' },
    { name: 'magenta', description: 'Magenta color (ANSI 5)' },
    { name: 'cyan', description: 'Cyan color (ANSI 6)' },
    { name: 'white', description: 'White color (ANSI 7)' },
    { name: 'orange', description: 'Orange color (used by Zellij UI)' },
];

export const topLevelBlocks = [
    { name: 'keybinds', description: 'Define keybindings for all modes. Contains mode blocks with bind statements.' },
    { name: 'themes', description: 'Define color themes. Each child node is a theme name containing color definitions.' },
    { name: 'plugins', description: 'Define plugin aliases. Each child is a plugin name with a location attribute.' },
    { name: 'load_plugins', description: 'Plugins to load at startup.' },
    { name: 'ui', description: 'UI-specific configuration options like pane frame styling.' },
    { name: 'env', description: 'Environment variables to set for all panes.' },
];

export function getOptionByName(name: string): ConfigOption | undefined {
    return configOptions.find(o => o.name === name) || uiOptions.find(o => o.name === name);
}

export function getAllOptionNames(): string[] {
    return configOptions.map(o => o.name);
}
