define(function(require) {
    var LabelList = require('./labellist'),
        Layout = require('vastui/layout');

    return function gitTree(arg){
        /************ Initialization ************/
        var options = arg || {},
            myId = arg.id,
            container = options.container || document.body,
            header = options.header,
            width = options.width,
            height = options.height,
            onselect = options.onselect;
            // type = options.type,
            // selectedColor = options.selectedColor || 'black',
            // selectedIcon = options.selectedIcon || '',
            // types = options.types || [];
        var nodeCounter = 0;
        var nameNodeDict = {};
        var allMergeDict = {};

        let appLayout = new Layout({
            margin: 10,
            padding: 0,
            container: container,
            cols: [
                {
                    width: 0.2,
                    id: myId + '-' + 'git-left'
                },
                {
                    width: 0.8,
                    id: myId + '-' + 'git-right'
                },
            ]
        });
        var svg = d3.select(appLayout.cell(myId + '-' + 'git-left')).append('svg:svg');
        width = parseInt(appLayout.cell(myId + '-' + 'git-left').style.width);
        svg.attr("width", width).attr("height", height);


        /************ Tree Structure ************/
        var Node = function(userId, fathers, action, duration, datetime, reason, nodename, type, source, target, linkname, datalink, value, data){
            if(fathers !== null){
                fathers = Array.isArray(fathers)? fathers : [fathers];
            }
            var node = {
                userId: userId,
                nodeId: nodeCounter++,
                position: {
                    x: null,
                    y: null
                },
                weight: 0,
                children: [],
                fathers: fathers,
                action: action,
                duration: duration,
                datetime: datetime || new Date(),
                reason: reason,
                type: type,
                nodename: nodename,
                source: source,
                target: target,
                linkname: linkname,
                datalink: datalink,
                value: value,
                data: data
            }
            if(nodename === "Merge"){
                let mergeName = "Merge";
                for(var i = 0; i < fathers.length; i++){
                    mergeName += fathers[i].nodename
                }
                allMergeDict[mergeName] = node;
            }
            nameNodeDict[nodename] = node;
            node.checkout = function(info){
                return graph.checkout(node, info);
            }
            return node;
        }

        /************ Global Variables ************/
        var Root = new Node(0, null, "Root", 0, null, null, "Root", "Root", null, null, null, null, null, null);    // Mark 0 as root/merge/...(which is structural-part) node
        
        var RecalPos = true;
        var fullVerticalStep = 20;
        var graph = svg;
        graph.myId = myId;
        graph.Root = Root;
        var durationStepConst = 0.01;   //Every (1/durationStepConst) second means 1 Step
        
        var stampId = 0;    //Each merge creates a timestamp
        var isPulling = false;
        var isMerging = false;
        var nodeMerging = null;
        var CurShowNode = Root;
        var durationRecord = 200;
        let pullState = Root;
        let NodesDrew = new Set();
        let lastMerge = Root;
        var leafNodes = [Root];

        /************** Label Part **************/
        // var labelWidth = parseInt(appLayout.cell("git-right").style.width);
        var labelList = new LabelList({
                                        id: myId,
                                        root: Root,
                                        container: appLayout.cell(myId + '-' + 'git-right'),
                                    });
        labelList.onShowConflictChoice = function(conflictNode, choice){
            console.log(conflictNode);
            console.log(choice);
            conflictNode.handleInfo = [];
            //NOTICE:   Abondon type info should be added after users' operations
            //          Restore type info should be added before the operations
            if(choice === "{Abondon Further Explore}"){
                let branches = conflictNode.conflictDependency.branches;
                for(var i = 0; i < branches.length; i++){
                    conflictNode.conflictDependency.trunk.type = "Abondon";
                    if(branches[i].action === "Add node"){
                        conflictNode.handleInfo.push({
                            type: "Abondon", 
                            action: "Add node",
                            nodename: branches[i].nodename,
                        })
                    }else if(branches[i].action === "Add link"){
                        conflictNode.handleInfo.push({
                            type: "Abondon",
                            action: "Add link",
                            linkname: branches[i].linkname,
                            source: branches[i].source,
                            target: branches[i].target,
                        })
                    }
                }
            }else if(choice === "{Restore Removed Node}"){
                let trunk = conflictNode.conflictDependency.trunk;
                let branches = conflictNode.conflictDependency.branches;
                trunk.type = "Restore";
                conflictNode.handleInfo.push(trunk);
                conflictNode.handleInfo = conflictNode.handleInfo.concat(branches);
            }else if(choice === "{Merge nodes with the same name}"){
                conflictNode.handleInfo.push({
                    type: "MergeSameName",
                    nodename: conflictNode.conflictNode.dupNode.nodename,
                })
            }else if(choice === "{Rename the local node}"){

            }
            graph.conflictSolved = true;
            // graph.refresh();
            // labelList.refresh(Root);
        }
        /************ Private Functions ************/

        function refillWeightFrom(node){
            if(!node.fathers || node.fathers.length === 0) node.weight = 1;
            else if(node.fathers.length === 1){
                node.weight = node.fathers[0].weight / node.fathers[0].children.length;
            }else{
                node.weight = 0;
                for(var i = 0; i < node.fathers.length; i++){
                    node.weight += node.fathers[i].weight / node.fathers[i].children.length;
                }
            }
            for(var i = 0; i < node.children.length; i++){
                refillWeightFrom(node.children[i]);
            }
        }

        function colorAlloc(nodeId) {
            //Google twenty
            var color_g20_addBlack = [   "#000000", "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", 
                                "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", 
                                "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", 
                                "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"   ];
            if(nodeId > color_g20_addBlack.length) {
                console.log("Too many ids. Colors aren't enough.");
                return "black";
            }
            return color_g20_addBlack[nodeId];
        }

        function findNodeByIdFrom(nodeId, node){
            var curNode = node;
            if(curNode.nodeId === nodeId){
                return curNode;
            }else{
                for(var i = 0; i < curNode.children.length; i++){
                    let rst = findNodeByIdFrom(nodeId, curNode.children[i]);
                    if(rst != null) return rst;
                }
            }
            return null;
        }
        function findNodesByUserIdFrom(userId, node){
            var curNode = node;
            var rstArray = [];
            if(curNode.userId === userId){
                rstArray.push(node);
            }
            for(var i = 0; i < curNode.children.length; i++){
                let rst = findNodesByUserIdFrom(userId, curNode.children[i]);
                if(rst.length != 0) rstArray = rstArray.concat(rst);
            }
            return rstArray;
        }
        function findNodeByServerIdFrom(serverId, node){
            var curNode = node;
            if(curNode.serverId === serverId){
                return curNode;
            }else{
                for(var i = 0; i < curNode.children.length; i++){
                    let rst = findNodeByServerIdFrom(serverId, curNode.children[i]);
                    if(rst != null) return rst;
                }
            }
            return null;
        }
        function highlightLeavesFrom(node){
            if(node.children.length === 0){
                node.highlight = 1;
                return;
            }else{
                node.highlight = -1;
            }
            for(var i = 0; i < node.children.length; i++){
                highlightLeavesFrom(node.children[i]);
            }
        }
        function cancelHighlightFrom(node){
            node.highlight = 0;
            for(var i = 0; i < node.children.length; i++){
                cancelHighlightFrom(node.children[i]);
            }
        }
        function showStateById(id){
            let node = graph.findNodeById(id);
            let backStack = graph.backRoute(node);
            if(backStack.mergeNode !== null){
                console.log(backStack.mergeNode);
                let temp = backStack.mergeNode.mergeInfo.map((k)=>{
                    return k.node;
                })
                if(!backStack.backNodes)backStack.backNodes = [];
                temp = temp.concat(backStack.backNodes);
                temp.sort((a, b)=>{return a.nodeId > b.nodeId;});
                graph.onIGraphBuild(temp, node);
            }else{
                backStack = backStack.backNodes;
                graph.onIGraphBuild(backStack.reverse(), node);
            }
        }

        /************ Public Functions ************/
        graph.selectCurShowNode = function(node){
            CurShowNode = svg.selectAll("#C" + node.nodeId);
            if(CurShowNode && CurShowNode != Root){
                CurShowNode.transition()
                    .ease(d3.easeBounce)
                    .duration(400)
                    .attr("r", 15);
                showStateById(parseInt(CurShowNode.attr("id").replace(/C/g, '')));
            }
            // else{
            //     CurShowNode = svg.selectAll("circle").attr("id", node.nodeId);
            //     console.log(CurShowNode);
            //     CurShowNode.transition()
            //             .ease(d3.easeBounce)
            //             .duration(400)
            //             .attr("r", 15);
            // }
        }
        graph.setPushColor = function(node){
            let cur = svg.selectAll("#C" + node.nodeId);
            CurShowNode.attr("stroke", "teal")
        }
        graph.checkout = function(beginNode, info){    //Both single and multiple node(s) supported
            var node = new Node(info.userId, beginNode, info.action, info.duration, info.datetime, info.reason, info.nodename, info.type, info.source, info.target, info.linkname, info.datalink, info.value, info.data);
            if(info.serverId >= 0) node.serverId = info.serverId;
            beginNode.children.push(node);
            return node;
        }

        graph.merge = function(mergeNodes, mergeReason){
            let mergeName = "Merge";
            for(var i = 0; i < mergeNodes.length; i++){
                mergeName += "-[" + mergeNodes[i].nodename + "]";
            }
            if(allMergeDict[mergeName]) return;
            let lastMerge = nameNodeDict["Merge"]? nameNodeDict["Merge"] : Root;
            var node = new Node(0, mergeNodes, "Merge", 0, (new Date()).toString(), mergeReason, mergeName, "Merge", null, null, null, null, null, null, null);
            
            let mergePath = [];
            node.data = [];
            let nameDict = {};
            for(var i = 0; i < mergeNodes.length; i++){
                curNode = mergeNodes[i];
                while(curNode && curNode.action !== "Merge" && curNode.action !== "Root"){
                    if(nameDict[curNode.action + "-" + curNode.nodename] === true){
                        curNode = curNode.fathers[0];
                        continue;
                    }
                    else{
                        mergePath.push({node: curNode, conflict: false});
                        node.data.push(curNode.data);
                        nameDict[curNode.action + "-" + curNode.nodename] = true;
                        curNode = curNode.fathers[0];
                    }
                }
                if(curNode.action === "Merge"){
                    for(var j = 0; j < curNode.mergeInfo.length; j++){  //TODO: data and node sequences have NOT been decided yet
                        if(nameDict[curNode.mergeInfo[j].node.action + "-" + curNode.mergeInfo[j].node.nodename] === true) continue;
                        else{
                            nameDict[curNode.mergeInfo[j].node.action + "-" + curNode.mergeInfo[j].node.nodename] = true;
                            mergePath.push({node: curNode.mergeInfo[j].node, conflict: false});
                            node.data.push(curNode.data[j]);
                        }
                    }
                }
            }
            node.reason = mergeReason;
            let set = new Set(mergePath);
            console.log("SSSSEEEETTTT:");
            console.log(mergePath);
            mergePath = Array.from(set);
            node.mergeInfo = mergePath;
            curNode = node;
            for(var i = 0; i < mergeNodes.length; i++){
                mergeNodes[i].children.push(node);
                // if(mergeNodes[i].duration > node.duration){
                //     node.duration = mergeNodes[i].duration;
                // }
            }
            graph.setIgraphLocalState(curNode);
            graph.refresh();
            return node;
        }

        graph.findNodeById = function(nodeId){
            return findNodeByIdFrom(nodeId, Root);
        }

        graph.findLatestNodeByUserId = function(userId){
            var curNode = Root;
            let rstArray = findNodesByUserIdFrom(userId, curNode);
            let max = 0;
            let record = null;
            for(var i = 0; i < rstArray.length; i++){
                if(max < rstArray[i].nodeId){ax
                    record = rstArray[i];
                    max = rstArray[i].nodeId;
                }
            }
            return record;
        }

        graph.findByUserIdAmong = function(userId, nodes){
            var rst = nodes.filter(function(d){
                return d.userId === userId;
            })
            if(rst.length > 1){
                console.log("Multiple branches own this same userId, which is not supported");
            }
            return rst[0];
        }

        graph.refresh = function(){
            function drawFrom(node){
                if(!NodesDrew.has(node)){
                    NodesDrew.add(node);
                    drawCircle(node);
                    for(var i = 0; i < node.children.length; i++){
                        drawLink(node, node.children[i]);
                        drawFrom(node.children[i]);
                    }
                }
            }

            // function refillPositionFrom(node){
            //     if(node.fathers === null){
            //         node.position.x = width / 2;
            //         node.position.y = 20;
            //     }else{
            //         let posY = 0;
            //         let posX = 0;
            //         if(node.fathers.length > 1){    //MergeNodes
            //             for(var i = 0; i < node.fathers.length; i++){
            //                 if(node.fathers[i].position.y > posY) posY = node.fathers[i].position.y;
            //                 posX += node.fathers[i].position.x;
            //             }
            //             posX = posX / node.fathers.length;
            //             node.position.x = posX;
            //             node.position.y = posY + 2 * fullVerticalStep;
            //         }else{ //if(node.fathers.length === 1)
            //             let fatherWidth = node.fathers[0].weight * width;
            //             let fatherStartX = node.fathers[0].position.x - fatherWidth / 2;
            //             // let fatherStartX  = 0;
            //             let previousLength = 0;
            //             let idx = node.fathers[0].children.indexOf(node);
            //             for(var i = 0; i < idx; i++){
            //                 previousLength += node.fathers[0].children[i].weight;
            //             }
            //             previousLength = previousLength * width;
            //             let posX = fatherStartX + previousLength + node.weight * width / 2;
            //             let posY = node.fathers[0].position.y + fullVerticalStep * node.duration * durationStepConst;
            //             node.position.x = posX;
            //             node.position.y = posY;
            //         }
            //     }
            //     for(var i = 0; i < node.children.length; i++){
            //         refillPositionFrom(node.children[i]);
            //     }
            // }
            function refillPosition(node){
                let mergePart = [];
                let todoQueue = [];
                let rstArray = [];
                if(!node) return;
                while(true){
                    if(node.action === "Merge"){
                        if(mergePart.indexOf(node) > -1){
                            if(todoQueue.length === 0) break;
                            node = todoQueue.splice(0, 1)[0];
                            continue;
                        }
                        mergePart.push(node);
                    }
                    rstArray.push(node)
                    todoQueue = todoQueue.concat(node.children);
                    if(todoQueue.length === 0) break;
                    node = todoQueue.splice(0, 1)[0];
                }
                rstArray.sort((a, b)=>{
                    return Date.parse(a.nodeId) - Date.parse(b.nodeId);
                })
                let totalConflicts = 0;
                for(var j = 0; j < rstArray.length; j++){
                    let node = rstArray[j];
                    if(node.fathers === null || node.fathers.length === 0){
                        node.position.x = width / 2;
                        node.position.y = 20;
                    }else{
                        let posY = 0;
                        let posX = 0;
                        if(node.action === "Conflict"){
                            node.position.x = width / 2;
                            totalConflicts++;
                            // for(var i = 0; i < node.fathers.length; i++){
                            //     if(node.fathers[i].position.y > posY) posY = node.fathers[i].position.y;
                            //     posX += node.fathers[i].position.x;
                            // }
                            // posX = posX / node.fathers.length;
                            // node.position.x = posX;
                            node.position.y = fullVerticalStep * durationRecord * (j + totalConflicts - 0.5) * durationStepConst + 20;
                        }else if(node.fathers.length > 1){    //MergeNodes
                            node.position.x = width / 2;
                            // for(var i = 0; i < node.fathers.length; i++){
                            //     if(node.fathers[i].position.y > posY) posY = node.fathers[i].position.y;
                            //     posX += node.fathers[i].position.x;
                            // }
                            // posX = posX / node.fathers.length;
                            // node.position.x = posX;
                            node.position.y = fullVerticalStep * durationRecord * (j + totalConflicts) * durationStepConst + 20;
                        }else{ //if(node.fathers.length === 1)
                            let fatherWidth = node.fathers[0].weight * width;
                            let fatherStartX = node.fathers[0].position.x - fatherWidth / 2;
                            let previousLength = 0;
                            for(var i = 0; i < node.fathers[0].children.length; i++){
                                if(node.fathers[0].children[i] === node)break;
                                previousLength = node.fathers[0].children[i].weight;
                            }
                            let posX = fatherStartX + previousLength * width + node.weight * width / 2;
                            let posY = fullVerticalStep * durationRecord * (j + totalConflicts) * durationStepConst + 20;
                            node.position.x = posX;
                            node.position.y = posY;
                        }
                    }
                }
            }

            function drawCircle(node){    //One color represents one ID
                var curDragNode = null;
                if(node.highlight === -1){
                    colorId = 0;
                    opacity = 0.1;
                }else if(node.highlight === 1){
                    colorId = node.userId;
                    opacity = 0.6;
                }else{
                    opacity = 0.4;
                    colorId = node.userId;
                }
                var circle = svg.append("circle")
                        .attr("id", "C" + node.nodeId)
                        .attr("class", "gitNodeHolder")
                        .attr("r", 10)
                        .attr("stroke", colorAlloc(colorId))
                        .attr("stroke-width", 2)
                        .attr("fill", colorAlloc(colorId))
                        .attr("fill-opacity", opacity)
                        .attr("stroke-opacity", opacity)
                        .attr("style","cursor: hand")
                        .attr("transform", "translate(" + node.position.x + "," + node.position.y + ")");
                circle.on("click", ()=>{
                    if(nodeMerging !== null){
                        let node1 = nodeMerging;
                        nodeMerging = null;
                        let node2 = graph.findNodeById(parseInt(circle.attr("id").replace(/C/g, '')));
                        graph.merge([node1, node2], "Merge Reason");
                        $('#comparator-modal').modal('show');
                        return;
                    }
                    if(CurShowNode !== null && CurShowNode != Root){
                        CurShowNode.transition()
                            .ease(d3.easeBounce)
                            .duration(400)
                            .attr("r", 10);
                    }
                    circle.transition()
                            .ease(d3.easeBounce)
                            .duration(400)
                            .attr("r", 15);
                    CurShowNode = circle;
                    showStateById(parseInt(CurShowNode.attr("id").replace(/C/g, '')));
                })
            }
            function nodeMenu(){
                $.contextMenu({
                    selector: '.gitNodeHolder',
                    callback: function(key, options) {
                        if(key == 'annotate') {
                            
                        } else if(key == 'merge'){
                            nodeMerging = graph.findNodeById(parseInt(this[0].id.replace(/C/g, '')));
                        }
                    },
                    items: {
                        merge: {name: "Merge", icon: "fa-link"},
                        annotate: {name: "Annotate", icon: "fa-commenting"},
                    }
                });
            }

            function drawLink(beginNode, endNode){
                var curveFunction = d3.line()
                        .x((d) => { return d.x; })
                        .y((d) => { return d.y; })
                        .curve(d3.curveCatmullRom.alpha(0.5));

                var lineData=[  {"x": beginNode.position.x,   "y": beginNode.position.y},  
                                {"x": endNode.position.x,     "y": endNode.position.y}   ];
                svg.append("path")
                    .attr("class", "gitLinkHolder")
                    .attr("id", "L" + beginNode.nodeId +"-" + endNode.nodeId)
                    .attr("d", curveFunction(lineData))
                    .attr("stroke","black")
                    .attr("stroke-opacity", 0.4)
                    .attr("stroke-width",2)
                    .attr("fill","none");
            }
            svg.selectAll("circle").remove();
            svg.selectAll("path").remove();

            if(RecalPos){
                refillWeightFrom(Root);
                refillPosition(Root);
                RecalPos = true;    //TODO Later revise
            }
            NodesDrew.clear();
            labelList.refresh(Root);
            drawFrom(Root);
            nodeMenu();
        }

        graph.insert = function(pullServerId, info){
            // datetime
            // username
            // nodesInfo
            let temp = null;
            if(pullServerId === -1){
                temp = Root;
            }else if(pullServerId.indexOf && pullServerId.indexOf("_") > -1){
                let arr = pullServerId.split("_");
                let temparr = [];
                let todoList = [];
                todoList.push(findNodeByServerIdFrom(parseInt(arr[0]), Root));
                for(var i = 0; i < todoList.length; i++){
                    temparr.push(todoList[i]);
                    todoList = todoList.concat(todoList[i].children);
                }
                temparr = new Set(temparr);
                temparr = Array.from(temparr);
                for(var j = 1; j < arr.length; j++){
                    let curarr = [];
                    let todoList = [];
                    todoList.push(findNodeByServerIdFrom(parseInt(arr[j]), Root));
                    for(var i = 0; i < todoList.length; i++){
                        curarr.push(todoList[i]);
                        todoList = todoList.concat(todoList[i].children);
                    }
                    curarr = new Set(curarr);
                    curarr = Array.from(curarr);
                    temparr = temparr.filter((k) => {
                        return curarr.indexOf(k) > -1;
                    });
                }
                if(temparr.length != 1){
                    console.log("Unexpected length of Merge");
                }else{
                    temp = temparr[0];
                }
            }else{
                temp = findNodeByServerIdFrom(pullServerId, Root);
            }
            if(temp === null){
                console.log("ServerId " + pullServerId +" Not Found.");
                return;
            }
            // A temporary method
            // In order to obtain the handler of a node,
            // however, repo things are deep copy. Now, only
            // use id to find hanlder, which is possibly not
            // able to support some complex structure

            for(var i = 0; i < info.nodesInfo.length; i++){
                temp = graph.checkout(temp, {
                    userId: info.userId,
                    datetime: info.datetime,
                    action: info.nodesInfo[i].action,
                    duration: info.nodesInfo[i].duration,
                    nodename: info.nodesInfo[i].nodename,
                    reason: info.nodesInfo[i].reason,
                    type: info.nodesInfo[i].type,
                    data: info.nodesInfo[i].data,
                    source: info.nodesInfo[i].source,
                    target: info.nodesInfo[i].target,
                    serverId: info.nodesInfo[i].serverId,
                });
            }
            graph.refresh();
            graph.selectCurShowNode(temp);
            return temp;
        }
        graph.onClickPull = function(){
            // if(isMerging)return;
            // if(isPulling){
            //     isPulling = false;
            //     cancelHighlightFrom(Root);
            // }else{
            //     isPulling = true;
            //     highlightLeavesFrom(Root);
            // }
            // graph.refresh();
            // return stampId;
            if(!graph.pullToIndividial(graph.findNodeById(parseInt(CurShowNode.attr("id").replace(/C/g, ''))))){
                alert("Only Root and Merge nodes are available for pulling");
            }
        }

        graph.onClickMerge = function(){
            if(isPulling)return;
            if(isMerging){
                isMerging = false;
                cancelHighlightFrom(Root);
            }else{
                isMerging = true;
                highlightLeavesFrom(Root);
            }
            graph.refresh();
        }

        graph.backRoute = function(node){
            let curNode = node;
            let backStack = [];
            if(curNode === null){
                console.log(id, "Not found");
                return;
            }
            while(curNode.fathers && curNode.fathers.length === 1){ //, which is NOT merge node
                backStack.push(curNode);
                curNode = curNode.fathers[0];
            }
            if(curNode.action === 'Merge'){
                return {mergeNode: curNode, backNodes: backStack};
            }else{
                return {mergeNode: null, backNodes: backStack};
            }
        }

        graph.getCurShowNode = function(){
            if(CurShowNode === Root) return Root;
            return graph.findNodeById(parseInt(CurShowNode.attr("id").replace(/C/g, '')));
        }

        graph.getNextNodeId = function(){
            return nodeCounter;
        }

        graph.getPullState = function(){
            return pullState;
        }

        graph.setPullState = function(pullnode){
            pullState = pullnode;
        }

        graph.getLastMerge = function(){
            return lastMerge;
        }
        graph.setLastMerge = function(newMerge){
            lastMerge = newMerge;
        }

        graph.modifyByNodename = function(name, info){
            console.log(nameNodeDict);
            nameNodeDict[name].nodename = info.label;
            nameNodeDict[name].reason = info.detail;
            nameNodeDict[info.label] = nameNodeDict[name];
            if(name !== info.label) nameNodeDict[name] = null;
            graph.refresh();
        }
        graph.clearRoot = function(newRoot){
            nodeCounter = 0;
            nameNodeDict = {};
            allMergeDict = {};
            if(newRoot === null) newRoot = new Node(0, null, "Root", 0, null, null, "Root", "Root", null, null, null, null, null, null);
            else if(!newRoot){
                console.log("newRoot not specified!");
                return;
            }
            graph.Root = Root = newRoot;
            graph.setLastMerge(newRoot);
            graph.setPullState(newRoot);
        }

        graph.appendConflictNodes = function(conflicts){
            // rst.push({link: i, conflict: conflictNodes[i], conflictReason: explainConflict(conflictLinks[i])});
            // rst.push({node: i, conflict: conflictNodes[i], conflictReason: explainConflict(conflictNodes[i])});
            for(var i = 0; i < conflicts.length; i++){
                if(conflicts[i].node){
                    curNode = graph.getCurShowNode();
                    let newnode = new Node(0, curNode, "Conflict", 0, new Date(), conflicts[i].conflictReason, conflicts[i].node, "Node-Conflict", null, null, null, false, 0, null)
                    newnode.conflictDependency = conflicts[i].dependency;
                    curNode.children.push(newnode);
                    curNode = newnode;
                }else if(conflicts[i].link){
                    curNode = graph.getCurShowNode();
                    let newnode = new Node(0, curNode, "Conflict", 0, new Date(), conflicts[i].conflictReason, conflicts[i].node, "Link-Conflict", null, null, null, false, 0, null)
                    newnode.conflictDependency = conflicts[i].dependency;
                    curNode.children.push(newnode);
                    curNode = newnode;
                }else{
                    console.log("Unexpected conflicts: " + conflicts[i]);
                }
            }
        }
        graph.getLeafNodes = function(option){
            if(!option){
                option = myId;
            }
            if(option === "collaboration"){
                let todoList = Root.children;
                leafNodes = [];
                for(var i = 0; i < todoList.length; i++){
                    if(todoList[i].children.length > 0){
                        todoList = todoList.concat(todoList[i].children);
                    }else{
                        leafNodes.push(todoList[i]);
                    }
                }
                let set = new Set(leafNodes);
                leafNodes = Array.from(set);
                return leafNodes;
            }else{
                cur = Root;
                while(true){
                    if(cur.children.length > 0){
                        cur = cur.children[0];
                    }else break;
                }
                return cur;
            }
        }

        /************ Example ************/
        // var InfoA = {
        //     // username: "Alan",
        //     userId: 1,
        //     duration: 100,  //second
        //     action: "Add Node 1",
        // }
        // var InfoB = {
        //     // username: "Alan",
        //     userId: 2,
        //     duration: 200,  //second
        //     action: "Add Node 2",
        // }
        // var InfoC = {
        //     // username: "Alan",
        //     userId: 3,
        //     duration: 200,  //second
        //     action: "Add Node 3",
        // }
        // var InfoC2 = {
        //     // username: "Alan",
        //     userId: 3,
        //     duration: 300,  //second
        //     action: "Add Node 4",
        // }
        // var InfoB2 = {
        //     // username: "Alan",
        //     userId: 2,
        //     duration: 200,  //second
        //     action: "Add Node 6",
        // }
        // var InfoA2 = {
        //     // username: "Alan",
        //     userId: 1,
        //     duration: 100,  //second
        //     action: "Add Node 7",
        // }
        // let A = Root.checkout(InfoB2).checkout(InfoB2);
        // let B = Root.checkout(InfoA);
        // A = A.checkout(InfoB2);
        // let C = graph.merge([A, B], "reason");
        // C.checkout(InfoC).checkout(InfoC2);
        // graph.merge([graph.findLatestNodeByUserId(1), graph.findLatestNodeByUserId(2)])

        // RecalPos = true;
        // graph.refresh();

        return graph;
    }

})

// TODO: graph.pull -- should pass out a state as symbol
// TODO: log.append not here but share part