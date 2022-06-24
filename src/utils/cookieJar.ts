export interface cookieJar {
    takeCookie(name: string): string
    putCookie(name: string, value: string)
}
export function getCookieJar(): cookieJar {
    return {
        takeCookie(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        putCookie(name, value) {
            const d = new Date();
            d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        },
    }
}