export const LINK = {
    OAUTH: `https://manage-invite.xyz/invite`,
    TRANSLATE: 'https://translate.manage-invite.xyz.com',
    VOTE: 'https://top.gg/bot/619894044893380618/vote'
};

export enum ACCESS_LEVEL {
    DEFAULT = 0,
    STAFF = 3
}

export const ACCESS_TITLE = {
    DEFAULT: { level: 0, title: 'Default' },
    STAFF: { level: 3, title: 'ManageInvite Staff' }
};

export enum PERMISSION_LEVEL {
    SERVER_BLACKLISTED = -1,
    SERVER_MEMBER = 0,
    SERVER_MODERATOR = 2,
    SERVER_ADMINISTRATOR = 3,
    SERVER_OWNER = 4,
    BOT_MODERATOR = 9,
    BOT_OWNER = 10
}

export const PERMISSION_ROLE_TITLE = {
    ADMINISTRATOR: 'ManageInvite Administrator',
    MODERATOR: 'ManageInvite Moderator',
    BLACKLIST: 'ManageInvite Blacklist'
};
