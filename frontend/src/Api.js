import {from} from 'rxjs';

// export const URL_SERVER = "http://localhost:3001";
export const URL_SERVER = "https://fast-bayou-22628.herokuapp.com";

export const getMocked = () =>
    from(fetch(`${URL_SERVER}`).then((res) => res.json()));

export const changeTrack = (track) =>
    from(fetch(`${URL_SERVER}/changeTrack`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({track})
    })
        .then((res) => res.json()));

export const untrackTopic = (untrack) =>
    from(fetch(`${URL_SERVER}/untrack`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({untrack})
    })
        .then((res) => res.json()));


