'use strict';
import _ from 'lodash';
import Util from './Util';
import Rect from './Rect';
import Point from './Point';

var POINTS_NUMBER = 100;
var CONNECTIONS = 5;
var HOVER_COLOR = '#3498db';
var HOVER_RADIUS = 150;
var HOVER_ENABLED = true;

export default class {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dirty = true;
        this.startTime = null;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.boundary.width, this.boundary.height);

        // -- draw points
        _.forEach(this.points, (point) => {
            point.draw();
        });

        // draw hover point
        if (this.highlightPoint) {
            this.ctx.fillStyle = HOVER_COLOR;
            this.ctx.beginPath();
            this.ctx.arc(this.highlightPoint.x, this.highlightPoint.y, 2, 0, 2 * Math.PI, false);
            this.ctx.closePath();
            this.ctx.fill();

            var a = _.chain(this.points)
                .filter((point) => {
                    return Util.distanceBetweenPoints(point, this.highlightPoint) < HOVER_RADIUS;
                })
                .value();

            this.ctx.strokeStyle = HOVER_COLOR;
            a.forEach((point) => {
                this.ctx.globalAlpha = (HOVER_RADIUS - Util.distanceBetweenPoints(point, this.highlightPoint)) / HOVER_RADIUS;
                this.ctx.beginPath();
                this.ctx.moveTo(point.x, point.y);
                this.ctx.lineTo(this.highlightPoint.x, this.highlightPoint.y);
                this.ctx.stroke();
            });


        }
    }

    movePoints() {
        _.forEach(this.points, (point) => {
            point.move();
            point.updateLinksPosition(this.points);
        });

        this.dirty = true;
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.create();
    }

    create() {
        this.boundary = new Rect(0, 0, this.canvas.width, this.canvas.height);

        var points = [];

        for (var i = 0; i < POINTS_NUMBER; i++) {
            var p = new Point(this.ctx, 0, 0, null, i);
            p.setRandom(this.boundary);
            points.push(p);
        }

        _.forEach(points, function(point) {
            point.linkClosest(CONNECTIONS, points);
        })

        this.points = points;
    };

    highlight(mousePos) {

        if (mousePos) {
            this.highlightPoint = mousePos;
        } else if (this.highlightPoint && HOVER_ENABLED) {
            var hoverPoints = Util.getClosestPoints(this.highlightPoint, this.points, 3);

            this.points = _.map(this.points, function(point) {
                point.hover = _.some(hoverPoints, {
                    x: point.x,
                    y: point.y
                });
                return point;
            });

        }
    };

    update(timestamp) {
        this.movePoints();
        this.highlight();

        if (this.dirty) {
            this.draw();
            this.dirty = false;
        }

        if (this.startTime === null) {
            this.startTime = timestamp;
        }

        this.iteration = timestamp - this.startTime;

        requestAnimationFrame(this.update.bind(this));
    };

    bindEvents() {
        window.addEventListener('mousemove', (event) => {
            this.highlight(Util.getMousePos(this.canvas, event));
        });
        window.addEventListener('resize', _.debounce(() => {
            this.resize();
        }, 25));
    };

    init() {
        this.resize();
        this.create();
        this.bindEvents();
        this.update();
    };
};