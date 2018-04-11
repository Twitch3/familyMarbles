import { Space } from './space';
export class BoardSection {
    public mainSpaces: Space[] = [];
    public spawnSpaces: Space[] = [];
    public homeSpaces: Space[] = [];

    constructor() {
        for (let i = 0; i < 17; i++) {
            this.mainSpaces.push(new Space());
        }
        for (let i = 0; i < 5; i++) {
            this.spawnSpaces.push(new Space());
            this.homeSpaces.push(new Space());
        }
    }
}
