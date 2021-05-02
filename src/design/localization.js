import { get } from 'lodash';

const loc = {
    profile: {
        id: {
            ru: 'Идентификатор'
        },
        surname: {
            ru: 'Фамилия'
        },
        name: {
            ru: 'Имя'
        },
        snils: {
            ru: 'СНИЛС'
        },
        birthdate: {
            ru: 'Дата рождения'
        },
        msisdnConfirmed: {
            ru: 'Msisdn подтвержден'
        },
        emailConfirmed: {
            ru: 'Email подтвержден'
        },
        createTime: {
            ru: 'Дата регистрации'
        }
    }
};

export function getLoc(locId, locIdGroup, locale = 'ru') {
    return get(loc, `${locIdGroup}.${locId}.${locale}`, locId);
}
