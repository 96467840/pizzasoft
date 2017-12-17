import { User } from './';
import { Hash } from './CommonModels';
import { Location } from 'history';

export class Utils {

    // обычно такие вещи я делаю в отдельном классе
    static UsersUrl(page: number, params: string): string {
        return '/' + (page > 0 ? '' + page : '') + params;
    }

    static GetNextId(users: Array<User>): number {
        let id = 0;
        users.forEach((item) => {
            if (typeof item.id === 'undefined' || item.id == null) return;
            if (item.id > id) id = item.id;
        });
        return id + 1;
    }

    static isValidDate(s: string): boolean {
        try {
            let bits = s.split('.');
            let d = new Date(parseInt(bits[2]), parseInt(bits[1]) - 1, parseInt(bits[0]));
            return d && (d.getMonth() + 1) == parseInt(bits[1]);
        } catch (e) {
            return false;
        }
    }

    // относительные урлы запретим 
    static checkRedirect(redirect: string | null, location: Location): boolean {
        if (redirect == null) return false;
        if (redirect.startsWith('//')) return false;

        // единственный парвильный вариант урл должен начинатся с ОДНОЙ /
        // но елси урл равен текущему то не надо делать редирект!
        if (redirect.startsWith('/')) {
            let curr = Utils.getCurrentUrl(location);
            if (curr == redirect) return false;
            return true;
        }

        return false;
    }

    static getCurrentUrl(location: Location): string {
        return location.pathname + location.search;
    }

    static get_from_location(location: Location): Hash<string> {
        let l: any = {};
        let g = location.search;//window.location.search;
        if (g) {
            g = g.substr(1);
            l = Utils.split_url_params(g);
        }
        return l;
    };

    static split_url_params(g: string): Hash<string> {
        let l: Hash<string> = {};
        let k = g.split("&");
        for (let h = 0, len = k.length; h < len; h++) {
            let e = k[h].split("=");
            let f = e[0];
            let m = e[1];
            m = decodeURIComponent(m.replace(/\+/g, " "));
            l[f] = m;
        }
        return l;
    }

    static join_url_params(g: Hash<string>): string {
        let l = [];
        for (let i in g) {
            // в теории! в таком случае не надо проверять hasOwnProperty (see sample in https://www.typescriptlang.org/docs/handbook/modules.html)
            //if (g.hasOwnProperty(i)) {
            l.push(i + '=' + encodeURIComponent(g[i]));
            //}
        }
        return l.join('&');
    };
}