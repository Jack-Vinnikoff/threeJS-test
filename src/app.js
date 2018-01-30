import *as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
let camera, controls, scene,renderer, mesh;

const geometricFigures = [];
const types = document.forms[0].elements.types;
const numb = document.forms[0].elements.numb;
const create = document.getElementById('create');

create.addEventListener('click',start);


// Создание HTML блока списка фигур
const div = document.createElement('div');
div.className = 'none-block';
container.appendChild(div);
const listElements = document.querySelector("div.none-block");
const divTop = document.createElement('div');
divTop.className = 'topName';
divTop.innerHTML = '<h3>Список Фигур</h3>';
listElements.appendChild(divTop);

//Создание кнопки "Удалить все"
const divBtnDeleteAll = document.createElement('div');
divBtnDeleteAll.className = 'delete-all';
divBtnDeleteAll.innerHTML = '<button>'+'Удалить все'+'</button>'
listElements.appendChild(divBtnDeleteAll);


let li;
const ul = document.createElement('ul');
ul.id = 'list';
listElements.appendChild(ul);

const init = () => {
    scene = new THREE.Scene;
    scene.background = new THREE.Color( 0xcccccc );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    //renderer.shadowMapEnabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 500;
    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // remove when using animation loop
    controls.enableZoom = true;

    // Источники света
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 300, 600 );
    scene.add( light );
    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );
    var light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
    renderer.render( scene, camera );
}


// Создание геометрической фигуры
function start (e) {
    e.preventDefault();
    const square = new THREE.BoxGeometry( 50, 50, 50 );
    const pyramid = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
    const sphere = new THREE.SphereBufferGeometry( 20, 32, 32 );
    switch (types.value) {
        case 'квадрат' : createShapes(square,+numb.value,'Квадрат'); break;
        case 'пирамида' : createShapes(pyramid,+numb.value,'Пирамида'); break;
        case 'сфера' : createShapes(sphere,+numb.value,'Сфера'); break;
    }
    if (geometricFigures.length >0) {
        addObjToScene();
        listOfFigures();
    }
    displayOffListFigures();
}

// Создаем и добавляем Объекты Mesh в массив
const createShapes = (figure,numb,name) => {
    if (numb>=1) {
        const geometry = figure;
        const material = new THREE.MeshPhongMaterial( { color: 'red', flatShading: true } );
        for(let i = 0; i < +numb; i++) {
            mesh = new THREE.Mesh( geometry, material );
            mesh.name = name;
            geometricFigures.push(mesh);
            mesh.position.x = ( Math.random() - 0.5 ) * 1000;
            mesh.position.y = ( Math.random() - 0.5 ) * 400;
            mesh.position.z = ( Math.random() - 0.5 ) * 400;

        }
    }
}

// Добавление созданых mesh объектов в сцену
const addObjToScene = () => {
    geometricFigures.forEach((item) =>{
        scene.add(item);
    })
    render();
}

// Список созданых фигур
const listOfFigures = () => {
    restartAllElementsLi();
    geometricFigures.forEach((item) =>{
        li = document.createElement('li');
        li.innerHTML = '<span>'+item.uuid+'</span>'+'<span>'+item.name+'</span>'+'<button class="delete">Удалить</button>';
        li.dataset.idnumb = item.uuid;
        list.appendChild(li);
    })
    eventForBtn();

};

// Удаляем HTML элемент Li который нужно удалить
const removeElemLi = (element) => {
    let elem = element.parentNode;
    elem.remove();
    removeFigures(elem.getAttribute('data-idnumb'));
    displayOffListFigures()
}

// Удаление объекта mesh из сцены и элемента массива geometricFigures.
const removeFigures = (id) => {
    geometricFigures.forEach((item,index)=> {
        if(item.uuid ==id) {
            scene.remove(item);
            geometricFigures.splice(index,1);
        }
    })
    render();
}

// Очищаем каждый раз блок "Список фигур" после нажатия кнопки "Создать"
const restartAllElementsLi = () => {
    const allLi = document.querySelectorAll('li');
    if(allLi){
     allLi.forEach((item) => item.remove())
    }
    return 0;
}

// Задаем событие каждой кнопки с классом "delete"
const eventForBtn = () => {
    const btnClassDelete = document.querySelectorAll('button.delete');
    if(btnClassDelete) {
        btnClassDelete.forEach((item) => item.addEventListener('click',()=> removeElemLi(item)))
    }
}

//Удаляем все созданные объекты одной кнопкой
const deleteAllObj = () => {
    geometricFigures.forEach((item) => {
        scene.remove(item);
    })
    geometricFigures.length = 0;
    restartAllElementsLi();
    render();
    displayOffListFigures();
}
divBtnDeleteAll.childNodes[0].addEventListener('click',deleteAllObj);

//Появление окна "Список фигур"
const displayOffListFigures = () => {
    if(geometricFigures.length > 0){
        return div.className = 'list-elements';
    }
    return div.className = 'none-block';
}

init();
render();