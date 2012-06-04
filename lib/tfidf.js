// 1.termFrequencyCount(array) 
// 2.directoryFrequencyCount() 
// 3.tfidf() -> kmeans
function TfidfValue(){
  var allterm = new Array;//term index

  var termFrequencyList = new Array;//length-> num of document
  var countOfterm = new Array;
  this.termFrequencyCount = function(array){
    var termlist = new Object;//termlist = { "someterm":value,  ...  }
    var count = 0;
    var copyarray = array.slice().sort();
    for(var i=0,len=copyarray.length; i<len; i++){
      if(copyarray[i].length >= 3 && !copyarray[i].match(/^[\s]/)){ //filter
        termlist[ copyarray[i]] = termlist[ copyarray[i]]+1 || 1;
        count++;
      }
    }
    termFrequencyList[termFrequencyList.length]=termlist;
    //countOfterm[countOfterm.length]=copyarray.length;
    countOfterm[countOfterm.length]=count;
  };

  var directoryFrequencyCache = new Object;
  this.directoryFrequencyCount = function(){
    var directorylist = new Object;
    var copyList = termFrequencyList.slice();
    for(var i=0, len=copyList.length; i<len; i++){
      for(var term in copyList[i]){
        directorylist[term] = directorylist[ term]+1 || 1
        //directorylist[term] = directorylist[term]+copyList[i][term] ||copyList[i][term];//総計
      }
    }
    directoryFrequencyCache = directorylist;
  };

/*
  //hash
  this.tfidf = function(){
    var copyList = termFrequencyList.slice();
    for(var i=0,tlen=termFrequencyList.length; i<tlen; i++){
      for(var j in copyList[i]){
        termFrequencyList[i][j]=
            ( Math.log(1+copyList[i][j])
              / Math.log( countOfterm[i])
              * Math.log( tlen/directoryFrequencyCache[j])
            );
      }
    }
    console.log("termFrequencyList",termFrequencyList);
    return termFrequencyList;
  };
*/
//hash + filter
  this.tfidf = function(){
    var copyList = termFrequencyList.slice();
    var ansList = new Array;
    for(var i=0,tlen=termFrequencyList.length; i<tlen; i++){
      var ansHash = new Object;
      for(var j in copyList[i]){
        if(directoryFrequencyCache[j]/tlen < 0.9){ //filter
          ansHash[j] = 
            ( Math.log(1+copyList[i][j])
              / Math.log( countOfterm[i])
              * Math.log( tlen/directoryFrequencyCache[j])
            );
        }
      }
      ansList[ansList.length]=ansHash;
    }
    console.log(ansList);
    return ansList;
  };

  //for squarevector ..use setTermIndex->tfidfA->kmeans
  //javascript においては array[i] が array["i"] であり配列を用いた
  //高速化は無意味、hashを使う。
/*  this.setTermIndex = function(){
    for(var term in directoryFrequencyCache){
      allterm[allterm.length]=term;
    }
  };
  this.tfidfA = function(){
    var array = new Array;
    for(var i=0,tlen=termFrequencyList.length; i<tlen; i++){//i->dic
      array[i]=new Array;
      for(var j=0,len=allterm.length; j<len; j++){
        if(termFrequencyList[i][allterm[j]])  
        array[i][j] =//set tfidf -> square vector.
          ( Math.log(1+termFrequencyList[i][allterm[j]])  
            / Math.log( countOfterm[i])
            * Math.log( tlen/directoryFrequencyCache[allterm[j]])
          );//
      }
    }
    console.log(array);
    return array;
  };
*/

}
