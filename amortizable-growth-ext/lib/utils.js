import typographicBase from 'typographic-base';

export function missingClass(string, prefix) {
    if (!string) {
        return true;
    }

    const regex = new RegExp(` ?${prefix}`, 'g');
    return string.match(regex) === null;
}

export function formatText(input) {
    if (!input) {
        return;
    }

    if (typeof input !== 'string') {
        return input;
    }

    return typographicBase(input, { locale: 'en-us' }).replace(
        /\s([^\s<]+)\s*$/g,
        '\u00A0$1',
    );
}