'use strict';

import Stars from './js/Stars';
import Util from './js/Util';

import './style/style.scss';

var elMain, elPoints;
var maxAngle = 30;

function setPerspectiveOrigin(event) {
    elMain = elMain ? elMain : document.getElementsByTagName('main')[0];
    elPoints = elPoints ? elPoints : document.getElementById('points');

    var windowSize = Util.getWindowSize();
    var offset = {
        x: (event.pageX - elPoints.offsetLeft - elPoints.offsetWidth / 2) / windowSize.x,
        y: (event.pageY - elPoints.offsetTop - elPoints.offsetHeight / 2) / windowSize.y
    };

    elPoints.style.webkitTransform = 'rotateY(' + Math.floor(offset.x * maxAngle) + 'deg) rotateX(' + Math.floor(offset.y * maxAngle) + 'deg)';
}

function init() {
    console.log('starting...');

    var stars = new Stars('playground');
    stars.init();

    window.addEventListener('mousemove', setPerspectiveOrigin, false)
}

window.addEventListener('load', init);
