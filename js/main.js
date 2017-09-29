import * as THREE from 'three';
import ColladaLoader from './ColladaLoader.js';
import {TweenMax, Expo} from "gsap";
var OrbitControls = require('three-orbit-controls')(THREE);


window.THREE=THREE;
var scene = new THREE.Scene();
var pieces=[];
window.scene=scene;



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ alpha: true ,antialias:true});
var snow=null;
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("sceneHolder").appendChild( renderer.domElement );
camera.name="Camera";
camera.position.z=20;
scene.add(camera);




var controls=new OrbitControls(camera);

var loader=new THREE.ObjectLoader();
		
loader.load(
	'assets/scene.json',
	function ( object) {
		snow=object;
		snow.position.z=0;

		extractObjects(snow.children[0]);

		pieces.forEach(item=>{
			spread(item);
			animetePiece(item);
		});

		snow.name="Scene";
		scene.add(snow);
	}
);


function animate() {
	requestAnimationFrame( animate );
	
	renderer.render( scene, camera );
}
animate();

function animateSnow(){
	pieces.forEach(item=>{
		animetePiece(item);
	});
}

function extractObjects(obj){
	if(obj.type=="Group"){
		obj.children.forEach(item=>{
			extractObjects(item);
		});
	}else{ 
		pieces.push(obj);
	}
}
function animetePiece(object){
	var delay=THREE.Math.randFloat(0,3);
	var duration=2;
	if(object.name=="Pipe"){
		duration=duration*2;
	}
	
	TweenMax.to(object.position,2,{delay:delay,ease: Expo.easeIn,x:object.finalPosition.x,y:object.finalPosition.y,z:object.finalPosition.z});
	TweenMax.to(object.rotation,2,{delay:delay,ease: Expo.easeIn,x:0,y:0});
}

function spread(object){
	var radius=50;
	
	object.finalPosition=Object.assign({}, object.position);
	object.finalRotation=Object.assign({}, object.rotation);

	object.position.x=THREE.Math.randFloat(-radius,radius);
	object.position.y=THREE.Math.randFloat(-radius,radius);
	object.position.z=THREE.Math.randFloat(-radius,radius);

	object.rotation.x=THREE.Math.randFloat(0,2*Math.PI);
	object.rotation.y=THREE.Math.randFloat(0,2*Math.PI);
	
	

}

window.explode=function(){
	pieces.forEach(item=>{
			var radius=50;
			TweenMax.to(item.position,1,{ease: Expo.easeOut,x:THREE.Math.randFloat(-radius,radius),y:THREE.Math.randFloat(-radius,radius),z:THREE.Math.randFloat(-radius,radius)});
		});
	setTimeout(animateSnow,3000);
}

