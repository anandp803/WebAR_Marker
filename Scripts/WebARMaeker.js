
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
var isplaced=true;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
class Demo {
    static async SetupXR(scene, options) {
        scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
        const root = new BABYLON.TransformNode("root", scene);
        // root.setEnabled(false);
       // const model = await BABYLON.SceneLoader.ImportMeshAsync("", "https://piratejc.github.io/assets/", "valkyrie_mesh.glb", scene);
        //model.meshes[0].parent = root;

        
        var planeOpts = {
            height:0.1,
            width:0.1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
        ANote0Video.rotationQuaternion = new BABYLON.Quaternion(new BABYLON.Vector3(0,0,90));
        ANote0Video.parent = root;
        ANote0Video.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        //var vidPos = (new BABYLON.Vector3(0,0,0.1));
        //ANote0Video.position = vidPos;
        var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
        var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex","https://anandp803.github.io/VideoURL/AR%20Rahman%20alpha_Vp8_vorbis.webm", scene,false);
        ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
        ANote0VideoVidTex.hasAlpha=true;
        ANote0VideoVidTex.video.muted=true;
        ANote0VideoVidTex.video.autoplay=false;

        ANote0VideoMat.roughness = 1;
        ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
        ANote0Video.material = ANote0VideoMat;

        //  // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var isPlayingvideo=false;
        var AbtnInsideAR = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play");
        AbtnInsideAR.width = "250px"
        AbtnInsideAR.height = "100px";
        AbtnInsideAR.left = "0px";
        AbtnInsideAR.top = "800px"; 
        AbtnInsideAR.color = "white";
        AbtnInsideAR.children[0].color = "black";
        AbtnInsideAR.children[0].fontSize = 50;
        AbtnInsideAR.color = "#FF7979";
        AbtnInsideAR.background = "white";
        AbtnInsideAR.isVisible=false;

        AbtnInsideAR.onPointerClickObservable.add(() => {
            if(isplaced==false)
            {
                if (ANote0VideoVidTex.video.paused) {
                ANote0VideoVidTex.video.play();
                AbtnInsideAR.textBlock.text = "Play";
                ANote0VideoVidTex.video.muted = false; // Unmute on play
                }else{
                    ANote0VideoVidTex.video.pause();
                AbtnInsideAR.textBlock.text = "Pause";
                ANote0VideoVidTex.video.muted = true;
                }
            }
        });

        advancedTexture.addControl(AbtnInsideAR);

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
            isplaced=false;
            root.translate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
        });


        xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
            console.log("Session started")
            AbtnInsideAR.isVisible=true;             
        });
    
        xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
            console.log("Session Ended");
            AbtnInsideAR.isVisible=false; 
            isplaced=true;
        })
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
