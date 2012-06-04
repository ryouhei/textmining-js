//
//K cluster : for(j:k){Cj}
//cluster center : u(Cj) = 1/|Cj| * for(i:Cj){xi}
//kmeans cost of a cluster Cj : Φ(Cj, z) = for(i:cj){pow(|| xi - z || , 2)}
//
//1. make k cluster
//2. set xi to cluster cj
//
function Mining(kinput, keyvalues){
  var k = kinput;
  var termvectors = keyvalues;//maplist=[],map={}
  
  //Output
  var cluster = new Array;//set of cluster centroids {c1,c2..,ck}
  var label = new Array;//set of cluster labels of E {l(e)| e=1,2,..,n}

  this.kmeans = function(){
    // fix random selection.
    for(var i=0,len=termvectors.length; i<1; i++){
      cluster[cluster.length] = termvectors[Math.floor(Math.random()*len)];
    }
    this.chooseSmartCenter();
    for(var i=0,len=termvectors.length; i<len; i++){
      label[i] = this.argminDistance(termvectors[i], cluster);
    }
    var changed = false;
    var iter = 0;
    do{
      for(var i=0,len=cluster.length; i<len; i++){
        this.updateCluster(i);
      }
      for(var i=0,len=termvectors.length; i<len; i++){
        var minDist=this.argminDistance(termvectors[i], cluster);
        if(label[i] !== minDist){
          label[i] = minDist;
          changed = true;
        }
      }
      iter++;
    }while(changed === true || iter <= 5);
    console.log("label",label);
    console.log("cluster",cluster);
    return cluster;
  }
  //updatecluster(ci); re calculate centroids 
  this.updateCluster = function(clusterNumber){
    var center = new Object;
    for(var i=0, len=label.length; i<len; i++){
      if(label[i]===clusterNumber){
        //for(var j=0, len=termvectors[i].length; j<len; j++){
        for(var j in termvectors[i]){
            center[j] = center[j]+termvectors[i][j] || termvectors[i][j];
        }
      }
    }
    cluster[clusterNumber]=center;
  };

  //argminDistance(ei,cj); cos()
  this.argminDistance = function( termvector, cluster){
    var minDistance = 0;//cos()
    var mincluster = undefined;
    for(var i=0,len=cluster.length; i<len; i++){
      var dist = this.cos(termvector, cluster[i]);
      if( minDistance<dist ) {
        minDistance=dist;
        mincluster = i;
      }
    }
    return mincluster;
  };

  //kmeans++ 
  this.chooseSmartCenter = function(){
    var currentPot = 0;
    var center = new Array;
    var closestdist = new Array;
    for(var i=0,len=termvectors.length; i<len; i++){
      var index = Math.floor(Math.random()*len);
      closestdist[closestdist.length] = this.cos(termvectors[i],termvectors[index]);
      currentPot += closestdist[i];
    }
    for(var i=1; i<kinput; i++){
      var bestpot = -1;
      var bestNewIndex = 0;
      for(var trial=0; trial<10; trial++){
        var newPot = 0;
        var index = Math.floor(Math.random()*termvectors.length);
        for(var j=0,len=termvectors.length; j<len; j++){//cosは類似度のためmax,距離ならmin
          //newPot += Math.min( this.cos(termvectors[j],termvectors[index]) ,
          //newPot +=min ->   if(newPot<bestpot)
          newPot += Math.max( this.cos(termvectors[j],termvectors[index]) ,
                  closestdist[j]);
        }
        if(bestpot<0 || newPot>bestpot){//store best result 
          bestpot = newPot;
          bestNewIndex = index;
        }
      }
      //add center
      cluster[cluster.length]=termvectors[bestNewIndex];
      currentPot = bestpot;
      for(var j=0,len=termvectors.length; j<len; j++){
        closestdist[j] = Math.max(
                this.cos(termvectors[j],termvectors[bestNewIndex]),
                closestdist[j]);
      }
    }
  };

//for hash
  this.cos = function(vec1, vec2){
    var inproduct=0;
    var absvec1=0;
    var absvec2=0;
    for(var x in vec1){
      inproduct += vec1[x]*vec2[x] || 0;
      absvec1 += vec1[x]*vec1[x];
    }
    for(var x in vec2){
      absvec2 += vec2[x]*vec2[x];
    }
    absvec1 = Math.pow(absvec1, 1/2);
    absvec2 = Math.pow(absvec2, 1/2);
    return inproduct/(absvec1*absvec2);
  };

//for array
  this.cosV = function(vec1,vec2){
    var inproduct=0;
    var absvec1=0;
    var absvec2=0;
    for(var i=0, len=vec1.length; i<len; i++){
      //cos=  vec1 ・ vec2 / |vec1| x |vec2|
      inproduct += vec1[i]*vec2[i] || 0;
      absvec1 += vec1[i]*vec1[i] || 0;
      absvec2 += vec2[i]*vec2[i] || 0;
    }
    absvec1 = Math.pow(absvec1, 1/2);
    absvec2 = Math.pow(absvec2, 1/2);
    return inproduct/(absvec1*absvec2);
  };
  this.getLabel = function(){
    return label;
  };
  this.getCluster = function(){
    return cluster;
  };
}
