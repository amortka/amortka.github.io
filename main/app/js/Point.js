'use strict';
import Util from './Util';

var DEFAULT_COLOR = '#2ecc71';
var HOVER_COLOR = '#3498db';

var POINTS_MOVE_DIST = 20;
var MIN_SPEED = 10;
var MAX_SPEED = 30;
var SPEED = 400;

export default class {
    constructor(ctx, x, y, color, name) {
        this.ctx = ctx;
        this.x = x || 0;
        this.y = y || 0;
        this.origin = {
            x: this.x,
            y: this.y
        };
        this.color = color || DEFAULT_COLOR;
        this.hover = false;
        this.name = name.toString() || '';
        this.iteration = 0;
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.r = ~~(Math.random() * 4);
    };

    setRandom(rect) {
        this.x = Math.random() * (rect.x2 - rect.x) + rect.x;
        this.y = Math.random() * (rect.y2 - rect.y) + rect.y;
        this.origin = {
            x: this.x,
            y: this.y
        };
    };

    setRandomDestination(rect) {
        this.x = Math.random() * (rect.x2 - rect.x) + rect.x;
        this.y = Math.random() * (rect.y2 - rect.y) + rect.y;
    };

    linkClosest(no, points) {
        var newLinks = Util.getClosestPoints(this, points, no);
        newLinks = newLinks.map(function(o) {
            return _.omit(o, 'links');
        });
        this.links = newLinks;
    };

    updateLinksPosition(points) {
        this.links = _.map(this.links, function(link) {
            //find new position of link
            var p = _.find(points, {
                name: link.name
            });
            link.x = p.x;
            link.y = p.y;

            return link;
        });
    };

    move() {
        if (this.destination && this.destination !== null) {
            //move a bit to the dest.
            this.x = Util.easeInOutQuad(this.iteration, this.x, this.destination.x - this.x, SPEED - this.speed);
            this.y = Util.easeInOutQuad(this.iteration, this.y, this.destination.y - this.y, SPEED - this.speed);
            if (Util.distanceBetweenPoints(this, this.destination) < 1) {
                this.destination = null;
            }
        } else {
            this.start = {
                x: _.clone(this.x),
                y: _.clone(this.y)
            };
            this.destination = Util.getRandomPointInRadius(this.origin, POINTS_MOVE_DIST);
            this.iteration = 0;
        }
        this.iteration++;
    };

    draw() {

        //draw link
        this.ctx.globalAlpha = 0.1;
        if (this.links) {
            this.ctx.strokeStyle = DEFAULT_COLOR;
            _.forEach(this.links, (link) => {
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(link.x, link.y);
                this.ctx.stroke();
            });
        }

        this.ctx.globalAlpha = 1;

        // draw point
        this.ctx.fillStyle = '#182329';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 1, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.hover ? HOVER_COLOR : this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.fill();
    };
}