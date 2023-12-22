## Chessmate

Chessmate is a chess tournament application to run round robin tourmanents followed by playoffs


### Installation

Download the repository from github into a folder of your choice.
Open the index.html file in a browser. This should put in cache some libraries used.


### Launch

Open the index.html file in Google Object

> If you use the same browser then the one you used for dowload, the libraries are cached and you should be able to use the app without internet


### What the app does

Chessmate is a chess tournament management application. It is meant to work standalone, from any computer, no internet required once downloaded. 
This version of the application does not store any information neither in the cloud nore on your computer.
You can add players into groups which are in 4 possible divisions. You can add groups but the devisions are fixed.
Once you start the tournament, chessmate will create all pairings for the qualifiers for each group and division. When all those games are done, 
chessmate will launch playoffs starting quater-finals with the top 8 players in each division.
Rankiong was defined using a points/games_played score.
A win gives you 2 points, a draw 1 and a loss 0.
Once all the games a done, tournament is done.

### Launching and scoring games

Chessmate will list the games which can be played using the availability of players. Each paring is put in a pairing box. The graph tells you how many games there will be.
The chessmate manager (the one using the software during the tournament) can launch games by clicking on the "play" icon in the center of the pairing box of a game.
The box is yellow by default. When launched, it turns red.
When a game is done, click on the name of the winner. The name will turn green. Click twice the same name and both will turn gray. Thats a draw.
When done, click the "check" icon in the middle of the pairing box. The pairing box will disappear and a new pairing box will appear.

### FAQ

Q: When I refresh the page will I loose all the data.
A: Yes, this version does not store any data anywhere

Q: If I make a mistake when scoring a game (I put the wrong name), can I correct?
A: Yes but only during qualifiers. you can retrieve the game by clicking the "toggle planned/completed" link and find the game you want to change.

Q: What if there is a tie for 8th place in playoffs
A: Chessmate will choose a player using a lotterie (random draw)

Q: How do you rank players?
A: In a group, ranking is by points. In a division, its by points per games played.


### Simple scenario

Lets say you want to organize round-robin tournament with playoffs. All players are same level. You dont know how many there will be players, but does not matter.
You use just one division, lets say division D and create just one group. You put all players in that group.
You end up having 20 players.
20 players in a round robin format is 190 games over 19 rounds. Thats a lot.
If you have less time create 3 groups. One with 6 and 2 with 7 players. You need more boards for that. around 15 simulatneous games.
But faster. Players will do 5/6 games max in qualifiers.
your choice.
Once you set up groups and players inside, launch the tournament.
Chessmate will list the games which can be played. Call them out "Please can XX now play YY". Then launch the pairing.
If result comes back just enter it and call the next game etc.
When all games are played, playoffs will launch automatically.
In the playoffs same logic.

If you have players of different strenght and you want to put them into seperate divisions, just do that. Functionality is the same just that each division will be handled seperately.

Think of putting a big screen and displaying the app on the screen.

