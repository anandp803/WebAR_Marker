
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
            height:0.13,
            width:0.2,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene); 
        ANote0Video.setPivotPoint(new BABYLON.Vector3(0, 0, 0));       
        ANote0Video.parent = root;  
        const childMesh = root.getChildren()[0]; // Assuming the first child
        console.log("childmesh",childMesh)
        if (childMesh) {
            childMesh.rotation =new BABYLON.Vector3.Zero();
            childMesh.position=new BABYLON.Vector3.Zero();
        }

        ANote0Video.setPivotPoint(new BABYLON.Vector3(0, 0, 0));
        //var vidPos = (new BABYLON.Vector3(0,0,0.1));
        //ANote0Video.position = vidPos;
        var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
        var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex","https://anandp803.github.io/VideoURL/DrSudhakar.webm", scene,false);
        ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
        //ANote0VideoVidTex.hasAlpha=true;
        ANote0VideoVidTex.video.muted=true;
        ANote0VideoVidTex.video.autoplay=false;

        ANote0VideoMat.roughness = 1;
        ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
         ANote0Video.material = ANote0VideoMat;

        // GUI play pause button
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
        //end play pause btn4

        // //screenshot button

        // function takeScreenshot() {
        //     console.log("1")
        //     html2canvas(canvas).then(canvas => {
        //         console.log("2")
        //         let screenshot = canvas.toDataURL(); // Convert canvas to base64 image
        //         download(screenshot, 'screenshot.png'); // Download the image
        //     });
        // }

        // function download(data, filename) {
        //     const anchor = document.createElement('a');
        //     anchor.href = data;
        //     anchor.download = filename;
        //     anchor.style.display = 'none';
        //     document.body.appendChild(anchor);
        //     anchor.click();
        //     document.body.removeChild(anchor);
        //   }
        // var Screenshpttexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");        
        // var ScreenshotbtnInsideAR = BABYLON.GUI.Button.CreateSimpleButton("but2", "Take Screenshot");
        // ScreenshotbtnInsideAR.width = "250px"
        // ScreenshotbtnInsideAR.height = "100px";
        // ScreenshotbtnInsideAR.left = "300px";
        // ScreenshotbtnInsideAR.top = "800px"; 
        // ScreenshotbtnInsideAR.color = "white";
        // ScreenshotbtnInsideAR.children[0].color = "black";
        // ScreenshotbtnInsideAR.children[0].fontSize = 50;
        // ScreenshotbtnInsideAR.color = "#FF7979";
        // ScreenshotbtnInsideAR.background = "white";
        // ScreenshotbtnInsideAR.isVisible=false;

        // ScreenshotbtnInsideAR.onPointerClickObservable.add(() => {
        //    //if(isplaced==false)
        //     //{
        //         console.log("3");
        //         takeScreenshot();
        //     //}
        // });
        // Screenshpttexture.addControl(ScreenshotbtnInsideAR);
        //screenshotbutton

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
            //root.setPreTransformMatrix(image.transformationMatrix);
            image.transformationMatrix.decompose(root.scaling, root.rotationQuaternion, root.position);
            root.setEnabled(true);
            root.rotation= new BABYLON.Vector3(0, 0, 0);
            isplaced=false;
            root.translate(BABYLON.Axis.X,0, BABYLON.Space.LOCAL);
            
        });


        xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
            console.log("Session started")
            AbtnInsideAR.isVisible=true; 
           // ScreenshotbtnInsideAR.isVisible=true; 
            xr.baseExperience.start
            root.setEnabled(true);
        });
    
        xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
            console.log("Session Ended");
            AbtnInsideAR.isVisible=false;
            ANote0VideoVidTex.video.pause();            
            ANote0VideoVidTex.video.muted = true;
           // ScreenshotbtnInsideAR.isVisible=false; 
            isplaced=true;
            AbtnInsideAR.textBlock.text = "Play";
            root.setEnabled(false);
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

        const xr=await Demo.SetupXR(scene, {
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
