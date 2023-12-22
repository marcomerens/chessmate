/*global $*/
var playermodal
var gamedata
$(document).ready(function(){
    $("#togglemore").click(function(e){
        e.preventDefault()
        $("#hideit").toggle()
    })
    $(".divsel").click(function(e){
        e.preventDefault()
        $(".divsel").removeClass("active")
        $(this).addClass("active")
        var division=$(this).attr("division")
        $(".division").hide()
        $(".division[division='"+division+"'").show()
    })
    $(".standings").on("click",".launcher",function(){
        $(this).closest(".gameblock").removeClass("text-bg-warning").addClass("text-bg-danger")
        $(this).hide()
        $(this).closest(".gameblock").addClass("launched")
        $(this).closest(".gameblock").find(".apply").show()
        
    })
    $(".standings,#completed").on("click",".gameblock.launched .someplayer",function(){
        var thisplayer=$(this).attr("name")
        var otherplayer=(thisplayer=="player1"?"player2":"player1")
            if ($(this).attr("status")=="win") {
                $(this).closest(".gameblock").find(".someplayer").css("color","gray")
                $(this).closest(".gameblock").find(".someplayer").attr("status","draw")
                
            }
            else {
                $(this).closest(".gameblock").find(".someplayer").attr("status","loss")
                $(this).closest(".gameblock").find(".someplayer").css("color","white")
                $(this).css("color","green")
                $(this).attr("status","win")
            }
            $(this).closest(".gameblock").find(".apply").css("color","green").addClass("active")
        
    })
    $(".standings,#completed").on("click",".apply.active",function(){
            $(this).css("color","white")
            $("#completed .gameblocks").append($(this).closest(".gameblock").removeClass("text-bg-danger").addClass("text-bg-dark"))
            var division=$(this).closest(".gameblock").attr("division")
            var player1=$(this).closest(".gameblock").attr("player1")
            var player2=$(this).closest(".gameblock").attr("player2")
            var game=$(this).closest(".gameblock").attr("game")
            var player1status=$(this).closest(".gameblock").find(".someplayer[name='player1']").attr("status")
            var player2status=$(this).closest(".gameblock").find(".someplayer[name='player2']").attr("status")
            var winner=(player1status=="win"?player1:player2)
            var winnername=gamedata.players.filter(function(d){return d.id==winner})[0].name
            var looser=(player1status=="win"?player2:player1)
            var loosername=gamedata.players.filter(function(d){return d.id==looser})[0].name
            if (!$(this).attr("playoff")) {
                gamedata.games.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player1})[0].played=1
                gamedata.games.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player1})[0].points=(player1status=="win"?2:(player1status=="loss"?0:1))
                gamedata.games.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player2})[0].played=1
                gamedata.games.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player2})[0].points=(player2status=="win"?2:(player2status=="loss"?0:1))
                console.log(gamedata)
                makeplayerstats(division)
                nextgames()
                graphit()
                if (!$(".division[division='"+division+"'] .skipplayoffs").is(":checked")) playoffhighlight(division)

                if (($(".standings[division='"+division+"'] .gameblock").length==0)&&(!$(".division[division='"+division+"'] .skipplayoffs").is(":checked"))) {

                    
                    $(".standings[division='"+division+"'] .message").text("PLAYOFFS")
                    $(".standings[division='"+division+"'] .launchplayoffs").show()
                    

                }

            }
            else {
                $(this).closest(".gameblock").hide()
                console.log(game)
                console.log(winnername)
                console.log(winner)
                gamedata.playoffgames.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player1})[0].played=1
                gamedata.playoffgames.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player1})[0].points=(player1status=="win"?2:(player1status=="loss"?0:1))
                gamedata.playoffgames.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player2})[0].played=1
                gamedata.playoffgames.filter(function(d){return d.id==game})[0]
                    .players.filter(function(d){return d.id.id==player2})[0].points=(player2status=="win"?2:(player2status=="loss"?0:1))
                
                if ($("#planned .gameblock[player1='"+game+"']").length>0) {
                    console.log("true")
                    $("#planned .gameblock[player1='"+game+"']").find(".someplayer[name='player1']").text(winnername)
                    $("#planned .gameblock[player1='"+game+"']").attr("player1",winner)
                }
                else {
                    console.log("false")
                    $("#planned .gameblock[player2='"+game+"']").find(".someplayer[name='player2']").text(winnername)
                    $("#planned .gameblock[player2='"+game+"']").attr("player2",winner)
                    
                }
                var ngame=""
                if (game.indexOf("s")>0) {
                    // updating 3rd place
                    ngame=division+'l'+game.substring(2)
                    console.log(ngame)
                    if ($("#planned .gameblock[player1='"+ngame+"']").length>0) {
                        console.log("true")
                        $("#planned .gameblock[player1='"+ngame+"']").find(".someplayer[name='player1']").text(loosername)
                        $("#planned .gameblock[player1='"+ngame+"']").attr("player1",looser)
                    }
                    else {
                        console.log("false")
                        $("#planned .gameblock[player2='"+ngame+"']").find(".someplayer[name='player2']").text(loosername)
                        $("#planned .gameblock[player2='"+ngame+"']").attr("player2",looser)
                        
                    }
                    
                }
                updateplayoff(game,winner,winnername,ngame,looser,loosername)
                nextgames()
                graphit()
            }
            if ($(".standings .gameblock").length==0 && $("#planned .gameblock").length==0) $("#message").text("IT'S OVER!!! THANKS TO ALL")
            autosave()

    })

    $(".launchplayoffs button").click(function(e){
        e.preventDefault()
        $(this).closest("p").hide()
        var division=$(this).closest(".standings").attr("division")
        $("#planned .gameblock[division='"+division+"']").remove()
        buildplayoffs(false,division)
        $(".standings[division='"+division+"'] .playoffs").show()  
        $("#completed .qualifiergame[division='"+division+"']").hide()
        graphit()
    })
    $(".addgroup").click(function(e){
        e.preventDefault()
        addgrouptodivision($(this).closest(".division").attr("division"))
    })
    $(".playerrow").on("click",".addplayer",function(){
        $("#saveplayer").attr("playerid","")
        $("#saveplayer").attr("group",$(this).closest(".playergroup").attr("group"))
        $("#saveplayer").attr("division",$(this).closest(".division").attr("division"))
        $("#playername").val("")
        playermodal.show()
    })
    $(".playerrow").on("click",".playername",function(e){
        e.preventDefault()
        $("#saveplayer").attr("playerid",$(this).attr("playerid"))
        $("#saveplayer").attr("group",$(this).closest(".playergroup").attr("group"))
        $("#saveplayer").attr("division",$(this).closest(".division").attr("division"))
        $("#playername").val($(this).text())
        playermodal.show()
    })
    $(".playerrow").on("click",".deleteplayer",function(e){
        e.preventDefault()
        $(this).closest("p").remove()
    })
    $(".playerrow").on("click",".deletegroup",function(e){
        e.preventDefault()
        //$(".playerlist:eq(0)").append($(this).closest(".playergroup").find(".playerlist p"))
        $(this).closest(".playergroup").remove()
    
        renamegroups()

    })
    
    $("#loadit").click(function(e){
        e.preventDefault()
        $.get("https://wpyy52bbhg.execute-api.us-east-1.amazonaws.com/default/savetos3",
        function(d){
            gamedata=d
            populate()
        })
    })
    $("#saveplayer").click(function(e){
        e.preventDefault()
        var playerid=$(this).attr("playerid")
        if (playerid=="") {
            var g=$(this).attr("group")
            var d=$(this).attr("division")
            playerid=new Date().getTime()
            $(".playerrow .playergroup[group='"+g+"'][division='"+d+"']").find(".playerlist").append("<p><a href='#' class='playername' playerid='"+playerid+"'>"+$("#playername").val().toLowerCase()+"</a> <i class='deleteplayer fas fa-minus-circle'></i></p>")
        }
        else {
            
            $(".playerrow .playername[playerid='"+playerid+"']").text($("#playername").val().toLowerCase())
        }
        playermodal.hide()
    })
    playermodal = new bootstrap.Modal('#playermodal')
    $("#generate").click(function(e){
        e.preventDefault()
        gamedata=generatepairings()
        makerounds()
        makeplayerstats()
        $(".standings").each(function(i,v){
            if ($(v).find(".statstable tbody tr").length>0) $(this).show()
        })
        $(".playoffs").hide()
        $(".playoffplayer").each(function(i,v){
            $(v).removeClass("badge").removeClass("text-bg-success").removeClass("text-bg-light")
            $(v).addClass("badge").addClass("text-bg-light")
            if ($(v).attr("seed")) {
                $(v).attr("player","")
            }
            else{
                $(v).attr("player",$(this).attr("winner"))
                $(v).text($(this).attr("winner").substring($(this).attr("winner")-1).toUpperCase())
                
            }
        })
        $("#message").text("LET'S PLAY CHESS")
        $(".standings .message").text("QUALIFIERS")

        $(".quarter,.semi,.final,.place3").each(function(i,v){
            $(v).css("color","black")
            $(v).removeClass("inactivegame")
            $(v).css("padding-left","2px")
            $(v).css("border-left-style","solid").css("border-left-width","1px").css("border-left-color","gray")
            
        })
        if (!$(".division[division='A'] .skipplayoffs").is(":checked")) {

            buildplayoffs(true,"A")}
        if (!$(".division[division='B'] .skipplayoffs").is(":checked")) {
            
            buildplayoffs(true,"B")}
        if (!$(".division[division='C'] .skipplayoffs").is(":checked")) {
            buildplayoffs(true,"C")}
        if (!$(".division[division='D'] .skipplayoffs").is(":checked")) {
            buildplayoffs(true,"D")}
        graphit()
        $("#qualifierdashboard").show()
        autosave()
        
    })
    $("#generateplayoffs").click(function(e){
        e.preventDefault()
        
        nextgames()
    })
    
    function autosave(){
    console.log(gamedata)
    $.post("https://wpyy52bbhg.execute-api.us-east-1.amazonaws.com/default/savetos3",
    JSON.stringify(gamedata),function(data,status){console.log(data);console.log(status)})
    }
    
    
    
    
    
    
})

function addgrouptodivision(division){
        var g=$(".groupmaster").clone()
        $(g).removeClass("groupmaster")
        $(g).find(".playerlist").html("")
        $(g).insertBefore($(".division[division='"+division+"']").find(".plusbutton"))
        $(g).find(".deletegroup").show()
        $(g).show()
        renamegroups()
}

function populate(){
    console.log(gamedata)
    $(".division").each(function(i,division){
        var div=$(division).attr("division")
        var l=gamedata.players.filter(function(d){return d.division==div})
        var groups=[]
        l.forEach(function(v){
            if (groups.indexOf(v.group)<0) {
                console.log("added")
                groups.push(v.group)
                addgrouptodivision(div)
            }
        })
        l.forEach(function(v){
            $(".playerrow .playergroup[group='"+v.group+"'][division='"+v.division+"']").find(".playerlist")
                .append("<p><a href='#' class='playername' playerid='"+v.id+"'>"+v.name+"</a> <i class='deleteplayer fas fa-minus-circle'></i></p>")

        })
        

    })
    makerounds()
    makeplayerstats()
    $(".standings").each(function(i,v){
        if ($(v).find(".statstable tbody tr").length>0) $(this).show()
    })    
    graphit()
    $("#qualifierdashboard").show()

}
    

function updateplayoff(game,winner,winnername,ngame,looser,loosername) {
    $(".standings .playoffplayer[player='"+game+"']").text(winnername)
    $(".standings").find("p[game='"+game+"']").find(".playoffplayer[player='"+winner+"']").removeClass("text-bg-light").addClass("text-bg-success")
    $(".standings .playoffplayer[player='"+game+"']").attr("player",winner)
   
    var g=gamedata.playoffgames.filter(function(d){return d.id==game})[0]
    if (g){
        if (g.players[0].id.id==winner) {
            g.players[0].played=1
            g.players[0].points=2
            
        }
        else {
            g.players[1].played=1
            g.players[1].points=2
            
        }
    }
    gamedata.playoffgames.forEach(function(v){
        if (v.players[0].id.id==game) v.players[0].id.id=winner
        if (v.players[1].id.id==game) v.players[1].id.id=winner
        
    })
    if (ngame!="") {
        // 3rd place
        $(".standings .playoffplayer[player='"+ngame+"']").text(loosername)
        $(".standings .playoffplayer[player='"+ngame+"']").attr("player",looser)
        gamedata.playoffgames.forEach(function(v){
            if (v.players[0].id.id==ngame) v.players[0].id.id=looser
            if (v.players[1].id.id==ngame) v.players[1].id.id=looser
        
        })
        
        
    } 
    
    
    
}
function playoffhighlight(divi) {
    
    $(".standings[division='"+divi+"']").each(function(i,division){
        var tempsdiv=[]
        $(division).find(".statstable tbody tr").each(function(j,player){
            tempsdiv.push([$(player).attr("player"),Number($(player).attr('rate')),$(player).attr("name")])
            $(player).removeClass("table-warning")
        })
        tempsdiv.sort(function(a,b){
            return b[1]-a[1]
            
        })
        $(tempsdiv).each(function(j,player){
            if (j<8 && player[1]>0) {
                    $(division).find(".statstable tr[player='"+player[0]+"']").addClass("table-warning")
            }
            
        })
    })

}

function buildplayoffs(prelim,divi){
    var tempgames=[]
    
    $(gamedata.playoffgames).each(function(i,v){
        if (v.division!=divi) tempgames.push(v)
    })
    gamedata.playoffgames=tempgames
    
    $(".standings[division='"+divi+"']").each(function(i,division){
        var tempsdiv=[]
        $(division).find(".statstable tbody tr").each(function(j,player){
            tempsdiv.push([$(player).attr("player"),Number($(player).attr('rate')),$(player).attr("name")])
            $(player).removeClass("table-warning").removeClass("table-success")

        })
        tempsdiv.sort(function(a,b){
            return b[1]-a[1]
            
        })
        $(tempsdiv).each(function(j,player){
            var playerdiv=$(division).find(".playoffplayer[seed='"+(j+1)+"']")
            if (prelim) 
                {
                    $(playerdiv).attr("player","seed"+(j+1))
                    $(playerdiv).text("seed"+(j+1))
                }
            else {
                if (player[1]>0) {
                    $(playerdiv).attr("player",player[0])
                    if (j<8) $(".statstable tr[player='"+player[0]+"']").addClass("table-success")
                    $(playerdiv).text(player[2])
                }
                else {
                    $(playerdiv).attr("player","")
                    $(playerdiv).text("Bye")
                    
                }
            }
            
        })
        var l1="",l2=""
        $(division).find(".quarter").each(function(j,game){
            if ($(game).find(".playoffplayer:eq(0)").attr("player")=="") {
                $(game).addClass("inactivegame")
                    .css("color","white")
                    .find(".playoffplayer").removeClass("badge").removeClass("text-bg-light")
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").attr("player",$(game).find(".playoffplayer:eq(1)").attr("player"))
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").text($(game).find(".playoffplayer:eq(1)").text())
            }
            else if ($(game).find(".playoffplayer:eq(1)").attr("player")=="") {
                $(game).addClass("inactivegame")
                    .css("color","white")
                    .find(".playoffplayer").removeClass("badge").removeClass("text-bg-light")
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").attr("player",$(game).find(".playoffplayer:eq(0)").attr("player"))
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").text($(game).find(".playoffplayer:eq(0)").text())
            }
            else {
                $(game).addClass("activegame")
            }
        })
        $(division).find(".semi").each(function(j,game){
            if ($(game).find(".playoffplayer:eq(0)").attr("player")=="") {
                
                $(game).addClass("inactivegame")
                    .css("color","white")
                    .find(".playoffplayer").removeClass("badge").removeClass("text-bg-light")
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").attr("player",$(game).find(".playoffplayer:eq(1)").attr("player"))
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").text($(game).find(".playoffplayer:eq(1)").text())
            }
            else if ($(game).find(".playoffplayer:eq(1)").attr("player")=="") {
                $(game).addClass("inactivegame")
                    .css("color","white")
                    .find(".playoffplayer").removeClass("badge").removeClass("text-bg-light")
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").attr("player",$(game).find(".playoffplayer:eq(0)").attr("player"))
                $(division).find(".playoffplayer[winner='"+$(game).attr("game")+"']").text($(game).find(".playoffplayer:eq(0)").text())
            }
            else {
                $(game).addClass("activegame")
            }
        })
        
        if ($(division).find(".statstable tbody tr").length>0) {
            $(division).find(".final").addClass("activegame")
            $(division).find(".place3").addClass("activegame")

        }
        makepayoffdivround(division)
        nextgames()

    })

}

function nextgames(){
    var playing=[]
    $(".standings .gameblock").each(function(i,v){
        playing.push($(v).attr("player1"))
        playing.push($(v).attr("player2"))
        
    })

    $("#planned .gameblock").each(function(i,v){
        if (playing.indexOf($(v).attr("player1"))<0 
            && playing.indexOf($(v).attr("player2"))<0 
            && gamedata.players.filter(function(d){return d.id==$(v).attr("player1")})[0] 
            && gamedata.players.filter(function(d){return d.id==$(v).attr("player2")})[0] )
        {
            $(".standings .gameblocks[division='"+$(v).attr("division")+"']").append(v)
            $(v).find(".fieldblock[name='result']").text("Playing now")
            $(v).find(".launcher").show()
            $(v).find(".planned").hide()
            //$(v).find(".playerdot").addClass("launched")
            $(v).removeClass("text-bg-secondary").addClass("text-bg-warning")
            playing=[]
            $(".standings .gameblock").each(function(i,v){
                playing.push($(v).attr("player1"))
                playing.push($(v).attr("player2"))
        
            })            
        } 
    })
}


function makepayoffdivround(division){
    console.log("here")
    $(division).find(".activegame").each(function(i,game){
    if ($(game).find(".playoffplayer:eq(0)").attr("player")!="" && $(game).find(".playoffplayer:eq(1)").attr("player")!="") {
    
        var m=$(".masterblock").clone()
        $(m).removeClass("masterblock").addClass("gameblock")
        var d={division:$(division).attr("division"),
            phase:($(game).parent().index()==0?"Quarter Final":($(game).parent().index()==1?"Semi Final":($(game).parent().parent().index()==1?"Final":"3rd Place"))),
            player1:$(game).find(".playoffplayer:eq(0)").text(),
            player2:$(game).find(".playoffplayer:eq(1)").text()

        }
        console.log(d)
        Object.keys(d).forEach(function(key){
            $(m).find(".fieldblock[name='"+key+"']").text(d[key])
        })
        $(m).attr("division",d.division)
            .attr("game",$(game).attr("game"))
            .addClass("playoffgame")
            .attr("player1",$(game).find(".playoffplayer:eq(0)").attr("player"))
            .attr("player2",$(game).find(".playoffplayer:eq(1)").attr("player"))
            .find(".apply").attr("playoff","playoff")
        
       gamedata.playoffgames.push({
                            id:$(game).attr("game"),
                            division:d.division,phase:d.phase,
                            players:[{id:{id:$(game).find(".playoffplayer:eq(0)").attr("player")},
                            played:0,points:0,white:true},
                            {id:{id:$(game).find(".playoffplayer:eq(1)").attr("player")},played:0,points:0,white:false}]})
                            
        $("#planned .gameblocks").append(m)
        //$(m).find(".playerdot").css("color","black")
        
        $(m).show()
    }
    })
    //nextgames()

}

function makerounds(){
    $("#planned .gameblocks .gameblock").remove()
    $(".standings .gameblocks .gameblock").remove()
    $("#completed .gameblocks .gameblock").remove()
    gamedata.games.forEach(function(v){
        var m=$(".masterblock").clone()
        $(m).removeClass("masterblock").addClass("gameblock")
        var w=0,b=1
        if (!v.players[0].white) {
            w=1;b=0
        }
        var d={division:v.division,phase:"Group "+v.group,player1:v.players[w].id.name,player2:v.players[b].id.name}

        Object.keys(d).forEach(function(key){
            $(m).find(".fieldblock[name='"+key+"']").text(d[key])
        })
        $(m).attr("division",v.division).attr("game",v.id).attr("player1",v.players[w].id.id).attr("player2",v.players[b].id.id).addClass("qualifiergame")
        
       
        $("#planned .gameblocks").append(m)
        //$(m).find(".playerdot").css("color","black")
        
        $(m).show()
    })
    nextgames()

}
function makeplayerstats(divi){
    gamedata.players.forEach(function(v){
        v.stats={
                rank:0,
                played:0,
                wins:0,
                losses:0,
                draws:0,
                points:0,
                rate:0
            }
    })
    var a=["A","B","C","D"]
    if (divi) {
        a=[divi]
    }
    a.forEach(function(onedivision){
        var x=$(".standings[division='"+onedivision+"']")
        gamedata.games.filter(function(d){return d.division==onedivision}).forEach(function(onegame){
            onegame.players.forEach(function(pl){
                gamedata.players.forEach(function(v){
                    if (v.id==pl.id.id && v.id!="") {
                        v.stats.played+=pl.played
                        v.stats.points+=pl.points
                        if (pl.played==1) {
                            if (pl.points==0) v.stats.losses++
                            if (pl.points==1) v.stats.draws++
                            if (pl.points==2) v.stats.wins++
                            v.stats.rate=Math.round(100*v.stats.points/v.stats.played)/100
                        }
                        
                    }
                })
            })

        })
        var onegroup=gamedata.players.filter(function(d){return d.division==onedivision})
        onegroup.sort(function(a,b){
            return b.stats.points-a.stats.points
        })
        onegroup.sort(function(a,b){
            return Number(a.group)-Number(b.group)
        })
        
        console.log(onegroup)
        var prevrate=10
        var prevrank=0
        $(x).find("tbody").html("")
        $(x).find(".stattablediv").html("")
        onegroup.forEach(function(pl,i){
            if (pl.id!="") {
                
                /*
                mod 1
                var rank=""
                if (pl.stats.rate<prevrate) {
                    rank=i+1
                    prevrank=i+1
                    prevrate=pl.stats.rate
                }
                */
                //
                var group=pl.group
                var grouptable=$(x).find("table[group='"+group+"']")
                if (grouptable.length==0) {
                    grouptable=$(x).find(".stattablemaster").clone().removeClass("stattablemaster").attr("group",group)
                    $(grouptable).find(".tabgroupname").text("Group "+group)
                    $(x).find(".stattablediv").append(grouptable)
                }
                var rank=grouptable.find("tbody tr").length+1
                //
            $(grouptable).find("tbody").append(
                "<tr name='"+pl.name+"' rate='"+pl.stats.rate+"' player='"+pl.id+"'>\
                <td>"+rank+"</td>\
                <td>"+pl.name+"</td>\
                <td>"+pl.stats.wins+"/"+pl.stats.draws+"/"+pl.stats.losses+"</td>\
                <td>"+pl.stats.points+"</td>\
                </tr>"
                
                )
            }
        })
    })
}
function renamegroups(){
    $(".playerrow").each(function(j,u){
       $(u).find(".playergroup").each(function(i,v){
            $(v).attr("group",i+1)
            $(v).attr("division",$(u).closest(".division").attr("division"))
            $(v).find(".grouptitle").text("Group "+(i+1))
        }) 
    }) 
}
function generatepairings(){
    var data={players:[],games:[]}
    
    $(".playergroup").each(function(m,v){
        var tempdata=[]
        var isreturn=$(v).closest(".division").find(".selmode").prop("checked")
        $(v).find(".playerlist p").each(function(j,u){
            var x={name:$(u).find(".playername").text(),id:$(u).find(".playername").attr("playerid"),
            group:$(v).attr("group"),division:$(v).attr("division"),stats:{
                rank:0,
                played:0,
                wins:0,
                losses:0,
                draws:0,
                points:0,
                rate:0
            }}
            data.players.push(x)
            tempdata.push(x)
            
        })
        var i=0
        while (i<tempdata.length-1) {
            var j=i+1
            while (j<=tempdata.length-1) {
                var t=(Math.random()>0.5)
                data.games.push({
                            id:"div"+$(v).attr("division")+"group"+$(v).attr("group")+"g"+i+"r"+j,
                            group:$(v).attr("group"),division:$(v).attr("division"),phase:"Qualifiers",
                            players:[{id:tempdata[i],played:0,points:0,white:t},
                            {id:tempdata[j],played:0,points:0,white:!t}]})
                if (isreturn) {
                    data.games.push({
                            id:"div"+$(v).attr("division")+"group"+$(v).attr("group")+"gb"+i+"r"+j,
                            group:$(v).attr("group"),division:$(v).attr("division"),phase:"Qualifiers",
                            players:[{id:tempdata[i],played:0,points:0,white:!t},
                            {id:tempdata[j],played:0,points:0,white:t}]})
                    
                }
                j++
                 
            }
            i++
        }
        

    })
    console.log(data)
    return data
}


function graphit(){

    Highcharts.chart('graphcontainer', {
    chart: {
        type: 'bar',
        animation:false
    },
    credits:{
        enabled:false,
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['Qualifiers',"Playoffs"]
    },
    yAxis: {
        min: 0,
        allowDecimals:false,
        title:{
            text:"Games"
        }
    },
    legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        floating: false
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Active',
        data: [$(".standings .gameblock.qualifiergame").length,$(".standings .gameblock.playoffgame").length]
    },
    {
        name: 'Planned',
        data: [$("#planned .gameblock.qualifiergame").length,$("#planned .gameblock.playoffgame").length]
    },
    {
        name: 'Completed',
        data: [$("#completed .gameblock.qualifiergame").length,$("#completed .gameblock.playoffgame").length]
    },]
});
}