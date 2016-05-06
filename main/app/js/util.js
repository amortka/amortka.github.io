'use strict';
import _ from 'lodash';

var Util = {
    getWindowSize: () => {
        var w = window;
        var d = document;
        var e = d.documentElement;
        var g = d.getElementsByTagName('body')[0];

        return {
            x: w.innerWidth || e.clientWidth || g.clientWidth,
            y: w.innerHeight || e.clientHeight || g.clientHeight
        }
    },
    getClosestPoints: (point, points, no) => {

        //remove point from points to not make link to itself
        points = points.filter(function(nextPoint) {
            if (point.name === nextPoint.name) {
                return false;
            }

            return !_.some(nextPoint.links, {
                    name: point.name
                })

        });

        points = points.map((p) => {
            p.dist = Util.distanceBetweenPoints(point, p);
            return _.omit(p, 'links');
        });

        var pointsByDistance = points.sort(function(p1, p2) {
            return p1.dist - p2.dist;
        });

        if (!_.isUndefined(no) && no < pointsByDistance.length) {

            return pointsByDistance.slice(0, no);
        }

        return pointsByDistance;
    },
    distanceBetweenPoints: (p1, p2) => {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    },
    getRandomPointInRadius: (centerPoint, radius) => {
        var angle = Math.random() * Math.PI * 2;
        return {
            x: centerPoint.x + radius * Math.cos(angle),
            y: centerPoint.y + radius * Math.sin(angle)
        };
    },
    getRandomPointInRect: (rect) => {
        return {
            x: Math.random() * (rect.x2 - rect.x) + rect.x,
            y: Math.random() * (rect.y2 - rect.y) + rect.y
        };
    },
    getMousePos: (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    },
    //t: currentTime, b: startVal, c: change, d: duration
    linearTween: (t, b, c, d) => {
        return c * t / d + b;
    },
    easeInOutQuad: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
};

export default Util;