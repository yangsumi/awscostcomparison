function setSelectRegion() {
    var region_data = new Array();

    // JSONでregionを取得する
    $.getJSON('http://aws.amazon.com/jp/ec2/pricing/ri-light-linux.json', function (data) {

       for (var i = 0; i < data.config.regions.length; i++) {
           //alert(JSON.stringify(data.config.regions[i].region));
           region_data[i] = data.config.regions[i].region;

       }
        // regionの入力
        var region = document.getElementsByName("region")[0];
        // 以前のoption要素をクリア
        region.options.length = 1;

        // テーブルの項目を操作し、選択肢を追加する
        for (var i = 0; i < region_data.length; i++) {
            region.options[i+1] = new Option(region_data[i], region_data[i]);
        }

    });

}

function setSelectType(sel) {
    // 選択されたserviceの取得
    var selected_service = document.getElementsByName("service")[0];
    var type_data= new Array();

    //loading
    $.mobile.showPageLoadingMsg();

    // 選択されたSERVICE,Regionから、インスタンスタイプ取得先を制御する
    var selected_service = selected_service.options[selected_service.selectedIndex].value;

    if(selected_service == "linux"){

        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/linux-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);

                    number += 1;

                }
            }

            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "rhel"){
        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/rhel-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);
                    
                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "sles"){
        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/sles-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);


                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "windows"){
        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/mswin-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "sqlstandard"){
        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/mswinSQL-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "sqlweb"){
        // JSONでEC2のインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/ec2/pricing/json/mswinSQLWeb-od.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].instanceTypes.length; i++) {
                for(var j = 0; j < data.config.regions[choice].instanceTypes[i].sizes.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].instanceTypes[i].type,
                        data.config.regions[choice].instanceTypes[i].sizes[j].size);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する
            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i], type_data[i]);
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "mysql"){

        // JSONでRDSのインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-standard-deployments.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].types.length; i++) {
                for(var j = 0; j < data.config.regions[choice].types[i].tiers.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].types[i].name,
                        data.config.regions[choice].types[i].tiers[j].name);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する

            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i]+"(Single)", type_data[i]+"Single");
            }
            for (var i = 0; i < type_data.length ; i++) {
                type.options[i+1+type_data.length] = new Option(type_data[i]+"(Multi)", type_data[i]+"Multi");
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();

        });

    }else if(selected_service == "oracle"){

        // JSONでRDSのインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-standard-deployments.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].types.length; i++) {
                for(var j = 0; j < data.config.regions[choice].types[i].tiers.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].types[i].name,
                        data.config.regions[choice].types[i].tiers[j].name);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する

            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i]+"(Single)", type_data[i]+"Single");
            }
            for (var i = 0; i < type_data.length ; i++) {
                type.options[i+1+type_data.length] = new Option(type_data[i]+"(Multi)", type_data[i]+"Multi");
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();


        });

    }else if(selected_service == "sqlserver"){

        // JSONでRDSのインスタンスタイプを取得する
        $.getJSON('http://aws.amazon.com/jp/rds/pricing/sqlserver/sqlserver-byol-ondemand.json', function (data) {
            // 選択された値をinstance_typeテーブルのインデックスとして使う
            var choice = sel.options[sel.selectedIndex].index-1;
            var number = 0;
            for (var i = 0; i < data.config.regions[choice].types.length; i++) {
                for(var j = 0; j < data.config.regions[choice].types[i].tiers.length;j++){
                    //alert(JSON.stringify(data.config.regions[choice].instanceTypes[i].type));

                    //名前付け
                    type_data[number] = getInstanceName(data.config.regions[choice].types[i].name,
                        data.config.regions[choice].types[i].tiers[j].name);

                    number += 1;
                }
            }
            // typeの入力
            var type = document.getElementsByName("type")[0];
            // 以前のoption要素をクリア
            type.options.length = 1;

            // テーブルの項目を操作し、選択肢を追加する

            for (var i = 0; i < type_data.length; i++) {
                type.options[i+1] = new Option(type_data[i]+"(Single)", type_data[i]+"Single");
            }
            for (var i = 0; i < type_data.length ; i++) {
                type.options[i+1+type_data.length] = new Option(type_data[i]+"(Multi)", type_data[i]+"Multi");
            }
            //loading終了
            $.mobile.hidePageLoadingMsg();


        });

    }


}


function getInstanceName(name1,name2){
//c1.largeなど
    var name;
    //タイプ別の名前付け
    if(name1 == "uODI"){
        name = "t1";
    }else if(name1 == "stdODI"){
        name = "m1";
    }else if(name1 == "secgenstdODI"){
        name = "m3";
    }else if(name1 == "hiMemODI"){
        name = "m2";
    }else if(name1 == "hiCPUODI"){
        name = "c1";
    }else if(name1 == "clusterComputeI"){
        name = "cc";
    }else if(name1 == "clusterHiMemODI"){
        name = "cr";
    }else if(name1 == "clusterGPUI"){
        name = "cg";
    }else if(name1 == "hiIoODI"){
        name = "hi";
    }else if(name1 == "hiStoreODI"){
        name = "hs";
    }

    //サイズ別の名前付け
    if(name2 == "u"){
        name += ".micro";
    }else if(name2 == "sm"){
        name += ".small";
    }else if(name2 == "med"){
        name += ".medium";
    }else if(name2 == "lg"){
        name += ".large";
    }else if(name2 == "xl"){
        name += ".xlarge";
    }else if(name2 == "xxl"){
        name += ".2xlarge";
    }else if(name2 == "xxxxl"){
        name += ".4xlarge";
    }else if(name2 == "xxxxxxxxl"){
        name += ".8xlarge";
    }

    //RDSのタイプ名前付けc
    if(name1 == "dbInstClass" && name2 == "uDBInst"){

    name = "db.t1.micro";
        
    }else if(name1 == "dbInstClass"){
    name = "db.m1";
        
    }else if(name1 == "hiMemDBInstClass"){
    name = "db.m2";
    }

    //RDSサイズ別の名前付け
    if(name2 == "smDBInst"){
        name += ".small";
    }else if(name2 == "medDBInst"){
        name += ".medium";
    }else if(name2 == "lgDBInst"){
        name += ".large";
    }else if(name2 == "xlDBInst"){
        name += ".xlarge";
    }else if(name2 == "xxlDBInst"){
        name += ".2xlarge";
    }else if(name2 == "xxxxDBInst"){
        name += ".4xlarge";
    }
    
    return name;
}


function getInstanceType(name1){

//jsonで取得できる素のインスタンスタイプ
    var name;

    if(name1.indexOf("t1") == 0){
        name = "u";
    }else if(name1.indexOf("m1") == 0){
        name = "std";
    }else if(name1.indexOf("m3") == 0){
        name = "secgenstd";
    }else if(name1.indexOf("m2") == 0){
        name = "hiMem";
    }else if(name1.indexOf("c1") == 0){
        name = "hiCPU";
    }else if(name1.indexOf("cc") == 0){
        name = "clusterComp";
    }else if(name1.indexOf("cr") == 0){
        name = "clusterHiMem";
    }else if(name1.indexOf("cg") == 0){
        name = "clusterGPU";
    }else if(name1.indexOf("hi") == 0){
        name = "hiIo";
    }else if(name1.indexOf("hs") == 0){
        name = "hiStore";
    }

    //jsonで取得できる素のRDSタイプ
    if((name1.indexOf("db.t1") == 0 || name1.indexOf("db.m1") == 0) && name1.indexOf("Multi") == -1){

        name = "dbInstClass";

    }else if((name1.indexOf("db.t1") == 0 || name1.indexOf("db.m1") == 0) && name1.indexOf("Multi") != -1){

        name = "multiAZDBInstClass";

    }else if(name1.indexOf("db.m2") == 0 && name1.indexOf("Multi") == -1){
        name = "hiMemDBInstClass";
    }else if(name1.indexOf("db.m2") == 0 && name1.indexOf("Multi") != -1){
        name = "multiAZHiMemInstClass";
    }
    //alert("pretype:"+name1);
    //alert("type:"+name);

    return name;
}

function getInstanceTypeforOracle(name1){
    //jsonで取得できる素のRDSタイプ
    //なぜかOracleのMulti-AZ JSONはRDSと違ってstdのtypeと同じ
    if(name1.indexOf("db.t1") == 0 || name1.indexOf("db.m1") == 0){

        name = "dbInstClass";

    }else if(name1.indexOf("db.m2") == 0){
        name = "hiMemDBInstClass";

    }


    return name;


}

function getInstanceSize(name1){
    var name;

    //jsonで取得できる素のインスタンスサイズ
    if(name1.indexOf(".micro") != -1){
        name = "u";
    }else if(name1.indexOf(".small") != -1){
        name = "sm";
    }else if(name1.indexOf(".medium") != -1){
        name = "med";
    }else if(name1.indexOf(".large") != -1){
        name = "lg";
    }else if(name1.indexOf(".xlarge") != -1){
        name = "xl";
    }else if(name1.indexOf(".2xlarge") != -1){
        name = "xxl";
    }else if(name1.indexOf(".4xlarge") != -1){
        name = "xxxx";
    }else if(name1.indexOf(".8xlarge") != -1){
        name = "xxxxxxxxl";
    }

    return name;
}

function getInstanceSizeforRDSRI(name1){
    var name;

    //jsonで取得できる素のインスタンスサイズ
    if(name1.indexOf(".micro") != -1){
        name = "u";
    }else if(name1.indexOf(".small") != -1){
        name = "sm";
    }else if(name1.indexOf(".medium") != -1){
        name = "med";
    }else if(name1.indexOf(".large") != -1){
        name = "lg";
    }else if(name1.indexOf(".xlarge") != -1 && name1.indexOf("db.m2.xlarge") != -1 ){
        name = "xlHiMem";
    }else if(name1.indexOf(".xlarge") != -1 && name1.indexOf("db.m2.xlarge") == -1 ){
        name = "xl";
    }else if(name1.indexOf(".2xlarge") != -1 && name1.indexOf("db.m2.2xlarge") != -1 ){
        name = "xxlHiMem";
    }else if(name1.indexOf(".2xlarge") != -1 && name1.indexOf("db.m2.2xlarge") == -1 ){
        name = "xxl";
    }else if(name1.indexOf(".4xlarge") != -1 && name1.indexOf("db.m2.4xlarge") != -1 ){
        name = "xxxxlHiMem";
    }else if(name1.indexOf(".4xlarge") != -1 && name1.indexOf("db.m2.4xlarge") == -1 ){
        name = "xxxxl";
    }

    return name;
}

function getRegionName(name1){
    var name;

    if(name1 == "us-east"){
        name = "us-east"
    }else if(name1 == "us-west-1"){
        name = "us-west";
    }else if(name1 == "us-west-2"){
        name = "us-west-2";
    }else if(name1 == "eu-west-1"){
        name = "eu-ireland";
    }else if(name1 == "ap-southeast-1"){
        name = "apac-sin";
    }else if(name1 == "ap-northeast-1"){
        name = "apac-tokyo";
    }else if(name1 == "ap-southeast-2"){
        name = "apac-syd";
    }else if(name1 == "sa-east-1"){
        name = "sa-east-1";
    }


    return name;
}

function getRDSDeployment(name1){
    var name;

    if(name1.indexOf("Single") != -1){
        name = "stdDeploy";
    }else if(name1.indexOf("Multi") != -1){
        name = "multiAZdeploy";
    }

    return name;
}
