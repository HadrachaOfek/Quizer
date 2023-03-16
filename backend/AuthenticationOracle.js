const KEY_SIZE = 20;
class AuthenticationOracle{
    

    constructor() {
        this.connectedUsersKeysToId = new Map();
        this.connectedUsersIdsToKeys = new Map();
    }

    /**
     * Generate a random key that not exist in the connectedUsersKeysToId map
     * @returns string with length of KEY_SIZE from the chars [a-zA-Z0-9] 
     */
    keyGen() {
        let key = "";
        for (let i = 0; i < KEY_SIZE; i++){
            switch (this.randomInt(0, 2)) {
                case 0:
                    key += String.fromCharCode(this.randomInt(97, 122)); //rand a char from a-z
                    break;
                case 1:
                        key += String.fromCharCode(this.randomInt(65, 90)); //rand a char A-Z
                    break;
                case 2:
                        key += String.fromCharCode(this.randomInt(48, 57)); //rand a num 0-9
                    break;
                default:
                    break;   
            }
        }
        if (this.connectedUsersKeysToId.has(key))
        {
            return this.keyGen();
        }
        return key;
    }
        
    /**
     * This function generate random number from the range start-end (include)
     * @param {number} start - the lowest number in the range
     * @param {number} end  - the heigest number in the range 
     * @returns random number from the range start-end (include)
     */
    randomInt(start, end){
            return Math.round((Math.random() * (Math.abs(end - start))) + start);
    }

    /**
     * add the _id into the list and generate a uniqe key
     * @param {string} _id the user _id from the db
     * @returns return uniqe key for the user if the user not in the system
     */
    setConnection(_id) {
        if (!this.connectedUsersIdsToKeys.has(_id)) {
            const key = this.keyGen();
            this.connectedUsersKeysToId.set(key, _id);
            this.connectedUsersIdsToKeys.set(_id, key);
            return key;
        }
        return this.connectedUsersIdsToKeys.get(_id);
    }

    /**
     * Return the user id if the user connect and the key found
     * @param {string} key the key that the oracle provide
     * @returns return the user id that write in the data base
     */
    getConnection(key) {
        return this.connectedUsersKeysToId.get(key);
    }

    /**
     * Check if the oracle provided thie given key
     * @param {String} key the key that the oracle provide
     * @returns return true if the key found else return false
     */
    isExist(key) {
        return this.connectedUsersKeysToId.has(key);
    }

    /**
     * The function remove connection 
     * @param {string} key the provided key from this oracle
     */
    removeConnection(key) {
        if (this.connectedUsersKeysToId.has(key)) {
            const _id = this.connectedUsersKeysToId.get(key);
            this.connectedUsersKeysToId.delete(key);
            this.connectedUsersIdsToKeys.delete(_id);
        }
    }

    
    /**
     * @returns ths format of this object as string
     */
    toString() {
        let delimiter = '='
        let str = "";
        for (let i = 0; i < KEY_SIZE/2-2; i++){
            str += delimiter;
        }
        str += "key"
        for (let i = KEY_SIZE/2+1; i < KEY_SIZE; i++){
            str += delimiter;
        }
        str += "\t\t";
        for (let i = 0; i < 12; i++){
            str += delimiter;
        }
        str += "id";
        for (let i = 0; i < 12; i++){
            str += delimiter;
        }
        str += "\n";
        
        this.connectedUsersKeysToId.forEach((value, key) => str += key + "\t\t" + value + "\n")
        return str;
    }

    /**
     * print the object to the console
     */
    print(){
        console.log(`${this}`);
    }


}

const authenticator = new AuthenticationOracle()
export default authenticator;