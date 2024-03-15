
var canvas = document.getElementById("renderCanvas");

var MarkerARbtn=document.getElementById("MarkerARbtn");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
class Demo {
    static async SetupXR(scene, options) {
        scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
        const root = new BABYLON.TransformNode("root", scene);
        // root.setEnabled(false);
        const model = await BABYLON.SceneLoader.ImportMeshAsync("", "https://piratejc.github.io/assets/", "valkyrie_mesh.glb", scene);
        model.meshes[0].parent = root;
        root.rotationQuaternion = new BABYLON.Quaternion();
        const xr = await scene.createDefaultXRExperienceAsync(options);
        const featuresManager = xr.baseExperience.featuresManager;
        const imageTracking = featuresManager.enableFeature(BABYLON.WebXRFeatureName.IMAGE_TRACKING, "latest", {
            images: [
                {
                    src: "https://anandp803.github.io/VideoURL/DrSudhakar-PosterA3.jpg",
                    estimatedRealWorldWidth: 0.2
                },
            ]
        });
        imageTracking.onTrackedImageUpdatedObservable.add((image) => {
            // root.setPreTransformMatrix(image.transformationMatrix);
            image.transformationMatrix.decompose(root.scaling, root.rotationQuaternion, root.position);
            root.setEnabled(true);
            root.translate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
        });
        return xr;
    }
}
class Playground {
    static async CreateScene(engine, canvas) {
        const scene = new BABYLON.Scene(engine);

        MarkerARbtn.addEventListener("click" ,function(){
            var AR=document.querySelector(".babylonVRicon");
            AR.click();    
        }); 

        await Demo.SetupXR(scene, {
            uiOptions: {
                sessionMode: "immersive-ar"
            }
        });
        return scene;
    }
}
createScene = function() { return Playground.CreateScene(engine, engine.getRenderingCanvas()); }
        window.initFunction = async function() {
            
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });
                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
