import sinon from 'sinon';

export function createMockScene() {
    let sceneMock = {
        scene: createMockSceneManager()
    };

    return sceneMock;
}

export function createMockSceneManager() {
    let managerMock = { // scene manager mock
        launch: sinon.stub().callsFake((sceneName) => 'mock')
    };

    return managerMock;
}