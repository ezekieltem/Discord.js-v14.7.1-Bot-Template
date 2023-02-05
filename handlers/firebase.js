var admin = require("firebase-admin");

var serviceAccount = require("../jsons/sensitive.json").firebaseCreds;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://discord-rblx-group-shouts-default-rtdb.firebaseio.com"
});

const database = admin.database()

module.exports = async (client) => {
    const getGroups = async function (){
        let response = await database.ref("groups").get()

        let groups = response.val()

        groups["__TEMPLATE"] = null

        return groups 
    }
    global.getGroups = getGroups


    /**
     * 
     * @param {*} id 
     * @returns {{any}}
     */
    const getGroupsFromServerId = async function (id){
        let response = await database.ref("groups").get()

        let groups = response.val()

        groups["__TEMPLATE"] = null

        let finalResponse = {}

        for (const [group_id, servers] in Object.entries(groups)) {
          for (const [s_id, c_id] in Object.entries(servers)) {
            if (s_id === id) {
              finalResponse[group_id] = c_id
            }
          }
        }

        return finalResponse 
    }

    global.getGroupsFromServerId = getGroupsFromServerId

    /**
     * 
     * @param {[]} requestedOverrides 
     */
    const getOverrides = async function (){
      let response = await database.ref("botAdmin-controls").get()

      let overrides = response.val()

      return overrides
    }

    global.getOverrides = getOverrides
}