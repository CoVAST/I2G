if(typeof define == 'function') define(function() { return i2gModel; });

function i2gModel(arg) {
    'use strict';
    var model = {};

    var options = arg || {},
        data = options.data || {nodes: [], links: []},
        tag = options.tag || '';

    var nodeCounter = 0,
        linkCounter = 0,
        nodes = data.nodes,
        links = data.links,
        nodeHash = {}, // hash table for storing nodes based on node id
        linkHash = {}; // hash table for storing links based on link id

    model.removeNode = function(nodeId) {
        delete nodeHash[nodeId];
        nodes = nodes.filter(function(d){
            return d.id != nodeId;
        });
        links.filter(function(link){
            return link.source.id === nodeId || link.target.id === nodeId;
        }).forEach(function(link){
            model.removeLink(link.id);
        })
        return model;
    }

    model.removeLink = function(linkId) {
        delete linkHash[linkId];
        links = links.filter(function(li){
            return li.id != linkId;
        });
        return model;
    }

    model.addNodes = function(newNodes) {
        var newNodes = (Array.isArray(newNodes)) ? newNodes : [newNodes];
        newNodes.forEach(function(newNode){

            if(!newNode.hasOwnProperty('id')) {
                newNode.id = nodeCounter++;
            } else { //remove existing node with the same id
                if(nodeHash.hasOwnProperty(newNode.id)) {
                    model.removeNode(newNode.id);
                }
                nodeCounter = parseInt(newNode.id) >= nodeCounter ? (parseInt(newNode.id) + 1) : nodeCounter;
            }
            if(!newNode.hasOwnProperty('datalink')) {
                newNode.datalink = false;
            }

            if(tag !== null) {
                newNode.id = tag + newNode.id;
            }

            nodeHash[newNode.id] = newNode;
            nodes.push(newNode);

        });
        return model;
    }

    model.addLinks = function(newLinks){
        var newLinks = (Array.isArray(newLinks)) ? newLinks : [newLinks];
        newLinks.forEach(function(newLink) {

            if(!newLink.hasOwnProperty('id')) {
                newLink.id = linkCounter++;
            } else { //remove existing node with the same id
                if(linkHash.hasOwnProperty(newLink.id)) {
                    model.removeNode(newLink.id);
                }
                linkCounter = parseInt(newLink.id) >= linkCounter ? (parseInt(newLink.id) + 1) : linkCounter;
            }
            if(typeof newLink.source !== 'object') {
                var sourceId = (tag===null) ? newLink.source : tag + newLink.source;
            } else {
                var sourceId = newLink.source.id;
            }
            newLink.source = nodeHash[sourceId];
            if(typeof newLink.target !== 'object') {
                var targetId = (tag===null) ? newLink.target : tag + newLink.target;
            } else {
                var targetId = newLink.target.id;
            }
            newLink.target = nodeHash[targetId];

            if(!newLink.hasOwnProperty('datalink')) {
                newLink.datalink = false;
            }
            linkHash[newLink.id] = newLink;
            links.push(newLink);
        });

        return model;
    };

    model.modifyNode = function(theNode, props) {
        var modNode = (typeof theNode == 'object') ? theNode : nodeHash[theNode];
        for(var p in props) {
            modNode[p] = props[p];
        }
    }

    model.modifyLink = function(theLink, props) {
        var modLink = (typeof theLink == 'object') ? theLink : linkHash[theLink];
        for(var p in props) {
            modLink[p] = props[p];
        }
    }

    model.removeNodes = function(query) {
        var nodeIds,
            query = query ||  {};

        if(query.all) {
            nodes.forEach(function(n) {
                model.removeNode(n.id);
            })
        } else {
            if(query.id) {
                nodeIds = query.id;
            } else if(query.type) {
                nodeIds = nodes.filter(function(n){
                    return n.type !== query.type;
                })
                .map(function(n){ return n.id });
            } else if(query.datalink) {
                nodeIds = nodes.filter(function(n){
                    return n.datalink !== query.datalink;
                })
                .map(function(n){ return n.id });
            }

            nodeIds.forEach(function(nid){
                model.removeNode(nid);
            });
        }

        return model;
    }

    model.removeLinks = function(query) {
        var linkIds,
            query = query ||  {};

        if(query.all) {
            links = [];
        } else {
            if(query.id) {
                linkIds = query.id;
            } else if(query.type) {
                linkIds = links.filter(function(li){
                    return li.type !== query.type;
                })
                .map(function(n){ return li.id });
            } else if(query.datalink) {
                linkIds = links.filter(function(li){
                    return li.datalink !== query.datalink;
                })
                .map(function(li){ return li.id });
            }
            linkIds.forEach(function(lid){
                removeLink(lid);
            });
        }

        return model;
    }

    model.appendGraph = function(subgraph) {
        var subgraph = subgraph || {nodes: null, links: null},
            newNodes = subgraph.nodes || [],
            newLinks = subgraph.links || [];

        if(newNodes.length) model.addNodes(newNodes);
        if(newLinks.length) model.addLinks(newLinks);

        return model;
    };

    model.nodeHash = nodeHash;
    model.linkHash = linkHash;
    model.getNodes = function() { return nodes; }
    model.getLinks = function() { return links; }

    return model;
}
