function setCharts(sel){

  options = {
      chart: {
          type: 'line',
          marginRight: 130,
          marginBottom: 45,
          zoomType: 'x'
      },
     title: {
          text: '',
          x: -20 //center
      },
      subtitle: {
          text: 'Source: aws.amazon.com',
          x: -20
      },
      xAxis: {
          title: {
              text: 'Term(month)'
          },
          min:0,
          max:36,
          tickInterval:3,
          minorTickInterval:1

      },
      yAxis: {
          title: {
              text: 'Cost($)'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }],
          min:0
      },
      tooltip: {
          valueSuffix: '$'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 100,
          borderWidth: 0
      },
      series:[]

  }

    //loading
    $.mobile.showPageLoadingMsg();


    // JSONで情報を取得する

    var service = document.getElementsByName("service")[0].options[document.getElementsByName("service")[0].selectedIndex].value;
    var region = document.getElementsByName("region")[0].options[document.getElementsByName("region")[0].selectedIndex].value;
    var type = getInstanceType(sel.options[sel.selectedIndex].value);
    var typefororacle = getInstanceTypeforOracle(sel.options[sel.selectedIndex].value)
    var sizeforrdsri = getInstanceSizeforRDSRI(sel.options[sel.selectedIndex].value);
    var size = getInstanceSize(sel.options[sel.selectedIndex].value);
    var deploy = getRDSDeployment(sel.options[sel.selectedIndex].value);

    //alert("type:"+type+","+"sizeforrdsri:"+sizeforrdsri+","+"size:"+size+","+"deploy:"+deploy);


    if(service == "linux"){
        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/linux-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                            }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/ri-light-linux.json',function (data) {



            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)




            //頭金、従量課金料金を取得してから合成する
                if(data.config.regions[i].region == region
                    && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                    && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                        for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                            if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                        }

                }
            }

            //alert("yr1:"+yrTerm1+",yrh1:"+yrTerm1Hourly);


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                yr1[m] = parseFloat(yrTerm1);
                }else{
                yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
               }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);
            
        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/linux-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/linux-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });


    }else if(service == "rhel"){
        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/rhel-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/rhel-ri-light.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //頭金、従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/rhel-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/rhel-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });


    }else if(service == "sles"){
        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/sles-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/sles-ri-light.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //頭金、従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/sles-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/sles-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });


    }else if(service == "windows"){

        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswin-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswin-ri-light.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //頭金、従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswin-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswin-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });



    }else if(service == "sqlstandard"){

        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQL-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQL-ri-light.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //頭金、従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQL-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQL-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });



    }else if(service == "sqlweb"){
        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();

        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意

        var ondemand = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQLWeb-od.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == getRegionName(region)
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        }


                }


            }
            for(var l=0;l<=36;l++){
                yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
            }

            options.series.push({
                name:"ondemand",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });


        });



        var light = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQLWeb-ri-light.json',function (data) {

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)


                        //頭金、従量課金料金を取得してから合成する
                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-light",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-light",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });


        var middle = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQLWeb-ri-medium.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1);
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                }
            }

            options.series.push({
                name:"1yr-middle",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-middle",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

            //$('#container').highcharts(options);

        });

        var heavy = $.getJSON('http://aws.amazon.com/jp/ec2/pricing/json/mswinSQLWeb-ri-heavy.json',function (data) {
            var yrTerm1;
            var yrTerm1Hourly;
            var yrTerm3;
            var yrTerm3Hourly;
            var yr1 = new Array();
            var yr3 = new Array();

            for(var i=0;i < data.config.regions.length; i++){
                for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                    for(var k=0; k < data.config.regions[i].instanceTypes[j].sizes.length; k++)

                        if(data.config.regions[i].region == region
                            && data.config.regions[i].instanceTypes[j].type.indexOf(type) == 0
                            && data.config.regions[i].instanceTypes[j].sizes[k].size.indexOf(size) == 0){
                            for(var l=0;l < data.config.regions[i].instanceTypes[j].sizes[k].valueColumns.length;l++){
                                if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1")
                                    yrTerm1 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm1Hourly")
                                    yrTerm1Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3")
                                    yrTerm3 = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                                else if(data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].name == "yrTerm3Hourly")
                                    yrTerm3Hourly = data.config.regions[i].instanceTypes[j].sizes[k].valueColumns[l].prices.USD;
                            }

                        }
                }


            }
            for(var l=0;l<=36;l++){
                yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
            }

            for(var m = 0;m <= 36; m++){
                if(m == 0){
                    yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                }else{
                    yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                }
            }

            options.series.push({
                name:"1yr-heavy",
                data:[
                    yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                    yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                    yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                ]
            });

            options.series.push({
                name:"3yr-heavy",
                data:[
                    yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                    yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                    yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                ]
            });

            //alert(JSON.stringify(options.series));

        });

        //完了時に表示
        $.when(ondemand,light,middle,heavy).done(
            function(){
                $('#container').highcharts(options);
                //loading終了
                $.mobile.hidePageLoadingMsg();
            });


    }else if(service == "mysql"){
        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        // ondemand はdeploymentによってURIが異なる、RIは同じURIから取得
        //RDSのJSONはなぜか価格にカンマが付いてるので除去する

        if(deploy == "stdDeploy"){

            var ondemand = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-standard-deployments.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].types.length; j++){
                        for(var k=0; k < data.config.regions[i].types[j].tiers.length; k++)


                            //従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].types[j].name.indexOf(type) == 0
                                && data.config.regions[i].types[j].tiers[k].name.indexOf(size) == 0){
                                yrTerm1Hourly = data.config.regions[i].types[j].tiers[k].prices.USD;
                            }


                    }


                }


                for(var l=0;l<=36;l++){
                    yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
                }

                options.series.push({
                    name:"ondemand",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

            });



            var light = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-light-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){
                                    
                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                    //カンマの除去
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                    //カンマの除去
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }




                options.series.push({
                    name:"1yr-light",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-light",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var middle = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-medium-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseInt(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseInt(yrTerm1);
                    }else{
                        yr1[m] = parseInt(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }


                options.series.push({
                    name:"1yr-middle",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-middle",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var heavy = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-heavy-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                    }
                }


                options.series.push({
                    name:"1yr-heavy",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-heavy",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            //完了時に表示
            $.when(ondemand,light,middle,heavy).done(
                function(){
                    //alert(JSON.stringify(options.series));
                    $('#container').highcharts(options);
                    //loading終了
                    $.mobile.hidePageLoadingMsg();
                });


        }else if(deploy == "multiAZdeploy"){
            var ondemand = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-multiAZ-deployments.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].types.length; j++){
                        for(var k=0; k < data.config.regions[i].types[j].tiers.length; k++)


                            //従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].types[j].name.indexOf(type) == 0
                                && data.config.regions[i].types[j].tiers[k].name.indexOf(size) == 0){
                                yrTerm1Hourly = data.config.regions[i].types[j].tiers[k].prices.USD;
                            }


                    }


                }
                for(var l=0;l<=36;l++){
                    yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
                }



                options.series.push({
                    name:"ondemand",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });


            });


            var light = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-light-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }
                options.series.push({
                    name:"1yr-light",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-light",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var middle = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-medium-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }


                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }


                options.series.push({
                    name:"1yr-middle",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-middle",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });


            var heavy = $.getJSON('http://aws.amazon.com/jp/rds/pricing/mysql/pricing-heavy-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                    }
                }


                options.series.push({
                    name:"1yr-heavy",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-heavy",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            //完了時に表示
            $.when(ondemand,light,middle,heavy).done(
                function(){
                    //alert(JSON.stringify(options.series));
                    $('#container').highcharts(options);
                    //loading終了
                    $.mobile.hidePageLoadingMsg();
                });

        }






    }else if(service == "oracle"){

        var yrTerm1;
        var yrTerm1Hourly;
        var yrTerm3;
        var yrTerm3Hourly;
        var yr1 = new Array();
        var yr3 = new Array();


        // JSONで料金を取得する,オンデマンド、Reserved、EC2,RDSによってJSONの構造が違うので注意
        // ondemand はdeploymentによってURIが異なる、RIは同じURIから取得
        //RDSのJSONはなぜか価格にカンマが付いてるので除去する

        if(deploy == "stdDeploy"){

            var ondemand = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-standard-deployments.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].types.length; j++){
                        for(var k=0; k < data.config.regions[i].types[j].tiers.length; k++)


                            //従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].types[j].name.indexOf(type) == 0
                                && data.config.regions[i].types[j].tiers[k].name.indexOf(size) == 0){
                                yrTerm1Hourly = data.config.regions[i].types[j].tiers[k].prices.USD;
                            }


                    }


                }


                for(var l=0;l<=36;l++){
                    yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
                }

                options.series.push({
                    name:"ondemand",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

            });



            var light = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-light-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                    //カンマの除去
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                    //カンマの除去
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }

                //alert("yr1:"+yrTerm1+",yr1h:"+yrTerm1Hourly+",yr3:"+yrTerm3+",yr3h:"+yrTerm3Hourly);


                options.series.push({
                    name:"1yr-light",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-light",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var middle = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-medium-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseInt(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseInt(yrTerm1);
                    }else{
                        yr1[m] = parseInt(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }


                options.series.push({
                    name:"1yr-middle",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-middle",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var heavy = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-heavy-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                    }
                }


                options.series.push({
                    name:"1yr-heavy",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-heavy",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            //完了時に表示
            $.when(ondemand,light,middle,heavy).done(
                function(){
                    //alert(JSON.stringify(options.series));
                    $('#container').highcharts(options);
                    //loading終了
                    $.mobile.hidePageLoadingMsg();
                });


        }else if(deploy == "multiAZdeploy"){
            var ondemand = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-multiAZ-deployments.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].types.length; j++){
                        for(var k=0; k < data.config.regions[i].types[j].tiers.length; k++)


                            //従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].types[j].name.indexOf(typefororacle) == 0
                                && data.config.regions[i].types[j].tiers[k].name.indexOf(size) == 0){
                                yrTerm1Hourly = data.config.regions[i].types[j].tiers[k].prices.USD;
                            }


                    }


                }
                for(var l=0;l<=36;l++){
                    yr1[l] = parseFloat(yrTerm1Hourly)*24*365/12*l;
                }

                //alert("yrTerm:"+yrTerm1Hourly);

                options.series.push({
                    name:"ondemand",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });


            });


            var light = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-light-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }
                options.series.push({
                    name:"1yr-light",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-light",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            var middle = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-medium-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365/12*l;
                }


                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1);
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365/12*m;
                    }
                }


                options.series.push({
                    name:"1yr-middle",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-middle",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });


            var heavy = $.getJSON('http://aws.amazon.com/jp/rds/pricing/oracle/pricing-li-heavy-utilization-reserved-instances.json',function (data) {

                for(var i=0;i < data.config.regions.length; i++){
                    for(var j=0;j < data.config.regions[i].instanceTypes.length; j++){
                        for(var k=0; k < data.config.regions[i].instanceTypes[j].tiers.length; k++)


                            //頭金、従量課金料金を取得してから合成する
                            if(data.config.regions[i].region == getRegionName(region)
                                && data.config.regions[i].instanceTypes[j].type.indexOf(deploy) == 0
                                && data.config.regions[i].instanceTypes[j].tiers[k].size == sizeforrdsri){
                                for(var l=0;l < data.config.regions[i].instanceTypes[j].tiers[k].valueColumns.length;l++){

                                    if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm1")
                                        yrTerm1 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm1Hourly")
                                        yrTerm1Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yrTerm3")
                                        yrTerm3 = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD.split(",").join("");
                                    else if(data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].name == "yearTerm3Hourly")
                                        yrTerm3Hourly = data.config.regions[i].instanceTypes[j].tiers[k].valueColumns[l].prices.USD;
                                }

                            }
                    }


                }
                for(var l=0;l<=36;l++){
                    yr3[l] = parseFloat(yrTerm3) + parseFloat(yrTerm3Hourly)*24*365*3;
                }

                for(var m = 0;m <= 36; m++){
                    if(m == 0){
                        yr1[m] = parseFloat(yrTerm1)+parseFloat(yrTerm1Hourly)*24*365;
                    }else{
                        yr1[m] = parseFloat(yrTerm1)*(Math.ceil(parseFloat(m/12))) + parseFloat(yrTerm1Hourly)*24*365*(Math.ceil(parseFloat(m/12)));
                    }
                }


                options.series.push({
                    name:"1yr-heavy",
                    data:[
                        yr1[0],yr1[1],yr1[2],yr1[3],yr1[4],yr1[5],yr1[6],yr1[7],yr1[8],yr1[9],yr1[10],yr1[11],yr1[12],
                        yr1[13],yr1[14],yr1[15],yr1[16],yr1[17],yr1[18],yr1[19],yr1[20],yr1[21],yr1[22],yr1[23],yr1[24],
                        yr1[25],yr1[26],yr1[27],yr1[28],yr1[29],yr1[30],yr1[31],yr1[32],yr1[33],yr1[34],yr1[35],yr1[36]

                    ]
                });

                options.series.push({
                    name:"3yr-heavy",
                    data:[
                        yr3[0],yr3[1],yr3[2],yr3[3],yr3[4],yr3[5],yr3[6],yr3[7],yr3[8],yr3[9],yr3[10],yr3[11],yr3[12],
                        yr3[13],yr3[14],yr3[15],yr3[16],yr3[17],yr3[18],yr3[19],yr3[20],yr3[21],yr3[22],yr3[23],yr3[24],
                        yr3[25],yr3[26],yr3[27],yr3[28],yr3[29],yr3[30],yr3[31],yr3[32],yr3[33],yr3[34],yr3[35],yr3[36]
                    ]
                });

                //alert(JSON.stringify(options.series));

                //$('#container').highcharts(options);

            });

            //完了時に表示
            $.when(ondemand,light,middle,heavy).done(
                function(){
                    //alert(JSON.stringify(options.series));
                    $('#container').highcharts(options);
                    //loading終了
                    $.mobile.hidePageLoadingMsg();
                });

        }


    }else if(service == "sqlserver"){



    }





    /**
     * Gray theme for Highcharts JS
     * @author Torstein Hønsi
     */

    Highcharts.theme = {
        colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, 'rgb(96, 96, 96)'],
                    [1, 'rgb(16, 16, 16)']
                ]
            },
            borderWidth: 0,
            borderRadius: 15,
            plotBackgroundColor: null,
            plotShadow: false,
            plotBorderWidth: 0
        },
        title: {
            style: {
                color: '#FFF',
                font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
        subtitle: {
            style: {
                color: '#DDD',
                font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
        xAxis: {
            gridLineWidth: 0,
            lineColor: '#999',
            tickColor: '#999',
            labels: {
                style: {
                    color: '#999',
                    fontWeight: 'bold'
                }
            },
            title: {
                style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            }
        },
        yAxis: {
            alternateGridColor: null,
            minorTickInterval: null,
            gridLineColor: 'rgba(255, 255, 255, .1)',
            minorGridLineColor: 'rgba(255,255,255,0.07)',
            lineWidth: 0,
            tickWidth: 0,
            labels: {
                style: {
                    color: '#999',
                    fontWeight: 'bold'
                }
            },
            title: {
                style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                }
            }
        },
        legend: {
            itemStyle: {
                color: '#CCC'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#333'
            }
        },
        labels: {
            style: {
                color: '#CCC'
            }
        },
        tooltip: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, 'rgba(96, 96, 96, .8)'],
                    [1, 'rgba(16, 16, 16, .8)']
                ]
            },
            borderWidth: 0,
            style: {
                color: '#FFF'
            }
        },


        plotOptions: {
            series: {
                shadow: true
            },
            line: {
                dataLabels: {
                    color: '#CCC'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            spline: {
                marker: {
                    lineColor: '#333'
                }
            },
            scatter: {
                marker: {
                    lineColor: '#333'
                }
            },
            candlestick: {
                lineColor: 'white'
            }
        },

        toolbar: {
            itemStyle: {
                color: '#CCC'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                hoverSymbolStroke: '#FFFFFF',
                theme: {
                    fill: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0.4, '#606060'],
                            [0.6, '#333333']
                        ]
                    },
                    stroke: '#000000'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0.4, '#888'],
                        [0.6, '#555']
                    ]
                },
                stroke: '#000000',
                style: {
                    color: '#CCC',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                        fill: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0.4, '#BBB'],
                                [0.6, '#888']
                            ]
                        },
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0.1, '#000'],
                                [0.3, '#333']
                            ]
                        },
                        stroke: '#000000',
                        style: {
                            color: 'yellow'
                        }
                    }
                }
            },
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(16, 16, 16, 0.5)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            }
        },

        scrollbar: {
            barBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0.4, '#888'],
                    [0.6, '#555']
                ]
            },
            barBorderColor: '#CCC',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0.4, '#888'],
                    [0.6, '#555']
                ]
            },
            buttonBorderColor: '#CCC',
            rifleColor: '#FFF',
            trackBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#000'],
                    [1, '#333']
                ]
            },
            trackBorderColor: '#666'
        },

        // special colors for some of the demo examples
        legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
        legendBackgroundColorSolid: 'rgb(70, 70, 70)',
        dataLabelsColor: '#444',
        textColor: '#E0E0E0',
        maskColor: 'rgba(255,255,255,0.3)'
    };

// Apply the theme
    var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
}
