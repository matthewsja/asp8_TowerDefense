// file separated out for testing bootstrap functions 
export function launchScenes(sceneManager) {
    sceneManager.launch('resources')
    sceneManager.launch('checkJSON')
    sceneManager.launch('gameRecords')
    sceneManager.launch('mapLogic')
    sceneManager.launch('mapLogicEnemy')
    sceneManager.launch('mapLogicTower')
    sceneManager.launch('hudLogic')
    sceneManager.launch('hudLogicTower')
}