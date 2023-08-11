document.addEventListener("DOMContentLoaded", function () 
{
    //grille de depart
    var tab =   [   ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m'],
                    ['m','m','p','s','s','s','b','m','m','m','m','m','m','m','t','s','s','s','m','m','m','m','m','m','m'],
                    ['m','m','m','s','s','s','s','m','m','m','m','m','m','m','s','s','s','s','m','m','m','m','m','m','m'],
                    ['m','m','m','s','m','m','m','m','m','m','m','m','m','m','m','m','m','s','m','m','m','m','m','m','m'],
                    ['m','m','s','s','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','m','m','m','m','m','m'],
                    ['m','s','s','s','s','s','s','m','m','m','m','m','m','m','s','s','b','s','s','s','m','m','m','m','m'],
                    ['m','s','s','s','s','s','s','m','m','m','m','m','m','m','s','s','s','s','s','s','m','m','m','m','m'],
                    ['m','m','m','m','m','m','s','m','m','m','m','m','m','m','s','m','m','m','s','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','s','m','m','s','m','s','s','m','s','m','m','m','s','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','s','s','t','b','s','s','s','s','s','m','m','m','s','s','m','m','m','m','m'],
                    ['m','m','m','m','s','m','m','m','m','s','m','s','s','m','m','m','m','m','s','s','s','m','m','m','m'],
                    ['p','s','s','t','b','s','s','s','s','s','m','s','m','m','m','m','m','m','m','b','s','m','m','m','m'],
                    ['m','m','m','m','s','m','m','m','s','s','s','s','t','m','m','m','m','m','m','s','s','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','t','s','j','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m']   
                ];
    const tab2 = tab;
    let positionJoueur = [13,21];
    let nombretresors = 2;
    let nombreCoups = 0;
    let score = 0;
    let temps;
    let minutes;
    let seconds;
    let time = 10;
    let gestionTouches = true;
    let timeIspaused = false;
    let gagner = false;
    let boutonMenu;


    //gestion des actions des boutons
    document.getElementById("Reinitialiser").addEventListener("click", Reinitialiser);
    document.getElementById("Button-rejouer").addEventListener("click",Restart);
    document.getElementById("Button-rejouer2").addEventListener("click",Restart);

    //gestion du jeu avec les touches du clavier
    document.addEventListener("keydown", function (event) 
    {
        if(gestionTouches)
        {
            if (event.key === "ArrowUp")
            {
                MoveUpPlayer();
            } 
            else if (event.key === "ArrowDown")
            {
                MoveDownPlayer();
            } 
            else if (event.key === "ArrowLeft") 
            {
                MoveLeftPlayer();
            } 
            else if (event.key === "ArrowRight") 
            {
                MoveRightPlayer();
            }
        }
        
    });

    //Creation de la grille de jeu de depart
    function createGrid() 
    {
        const gridContainer = document.getElementById("gridContainer");
        for (let i = 0; i < tab.length; i++)
        {
            for (let j = 0; j < tab[i].length; j++) 
            {
                let gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");

                let image = document.createElement("img");
                image.classList.add("grid-image");

                // Définir la couleur/images en fonction de la lettre dans le tableau
                switch (tab[i][j]) 
                {
                    case 'j':
                        image.src = "../Img/mario.png";
                        break;
                    case 's':
                        gridItem.style.backgroundColor = "white";
                        break;
                    case 'b':
                        image.src = "../Img/monster.jpg";
                        break;
                    case 't':
                        image.src = "../Img/apple.jpg";
                        break;
                    case 'p' :
                        image.src = "../Img/mario2.png";
                        break;
                    default:
                        image.src = "../Img/minecraft.png";
                }
                gridItem.appendChild(image);
                gridContainer.appendChild(gridItem);
            }
        }
    }


    //Temps ecouler
    function UpdateTime() {
        if(!timeIspaused)
        {
            temps = document.getElementById("time");
            minutes = Math.floor(time / 60);
            seconds = time % 60;
            temps.textContent = "" + minutes + "m " + seconds + " s";
            if(time > 120)
            {
                temps.style.color = "red";
            }
        }  
    }

    setInterval(function ()
    {
        time++;
        UpdateTime();
    }, 1000);


    //Mise a jour de la grille et des differents parametres
    function Update()
    {
        const gridContainer = document.getElementById("gridContainer");
    
        // Supprimer tous les éléments enfants de la grille
        while (gridContainer.firstChild)
        {
            gridContainer.removeChild(gridContainer.firstChild);
        }
        createGrid();

        //mise a jour du score et des autres parametres
        const affichageScore = document.getElementById("affichage-score");
        affichageScore.textContent = "" + score;
        const affichageNbCoups = document.getElementById("affichage-shift");
        affichageNbCoups.textContent = "" + nombreCoups;
        const messageGameOver = document.getElementById("message-GameOver");
        messageGameOver.textContent = "Vous avez perdue avec un Score de " + score + ", \nRealiser en " + minutes + "min et " + seconds + "s ," + "Vous avez effectuer " + nombreCoups + " deplacements !!\n" + "je suis convaincu que vous pouvez faire mieux !!"; 
        const messageGameWin = document.getElementById("message-GameWin");
        messageGameWin.textContent = "Vous avez terminer avec un Score max de " + score + ", \nRealiser en " + minutes + "min et " + seconds + "s, \n" + "Vous avez effectuer " + nombreCoups + " deplacements !!"; 
        UpdateTime();
        
    }
    createGrid();


    //reinitialisation du jeu
    function Reinitialiser()
    {
        location.reload();  
    }

    //Recommencer
    function Restart()
    {
        Reinitialiser();
        Update();
        const divGameOver = document.getElementById("gameOver");
        divGameOver.style.display = "none";
    }


    //fonction verifiant si un joueur a gagner la partie
    function Gagner()
    {
        if (score >= 25)  // Vérifiez si le score est supérieur ou égal à 15 car total max = 15
        {
            const divGagner = document.getElementById("gameWin");
            divGagner.style.display = "block";
            gestionTouches = false; // Désactivation des touches du clavier
        }
    }

    function PauseOn() {
        const divGamePause = document.getElementById("gamePause");
        divGamePause.style.display = "block";
        timeIspaused = true;
        gestionTouches = false; // Désactivation des touches du clavier
    }
    
    function PauseOff() {
        const divGamePause = document.getElementById("gamePause");
        divGamePause.style.display = "none";
        timeIspaused = false;
        gestionTouches = true; // Réactivativation des touches du clavier
    }

    //Partie perdue : Lorsque le joueur se fait attraper par le monstre
    function GameOver()
    {
        const divGameOver = document.getElementById("gameOver");
        divGameOver.style.display = "block";
        timeIspaused = true;
        gestionTouches = false; //desactivations temporaire des touches du clavier
        clearInterval();    
    }

    document.getElementById("Button-pause").addEventListener("click", PauseOn);
    document.getElementById("Button-reprendre").addEventListener("click", PauseOff);

    //Deplacement du monstre
    function MoveMonsters() 
    {
        let tab2 = JSON.parse(JSON.stringify(tab));
        // Pour chaque case verte (représentée par 'b') sur la grille
        for (let i = 0; i < tab.length; i++) {
            for (let j = 0; j < tab[i].length; j++) {
                if (tab[i][j] === 'b') 
                {
                    //Verification des directions disponibles
                    let directionDisponibles = []; 
                    if (tab[i - 1][j] === 's' || tab[i - 1][j] === 'j')
                    {
                        directionDisponibles.push('up');
                    }
                    if (tab[i + 1][j] === 's' || tab[i + 1][j] === 'j') 
                    {
                        directionDisponibles.push('down');
                    }
                    if (tab[i][j - 1] === 's' || tab[i][j - 1] === 'j') 
                    {
                        directionDisponibles.push('left');
                    }
                    if (tab[i][j + 1] === 's' || tab[i][j + 1] === 'j') 
                    {
                        directionDisponibles.push('right');
                    }
    
                    // Si des directions sont disponibles, choisir aléatoirement une direction et déplacer la case verte
                    if (directionDisponibles.length > 0) {
                        const randomDirection = directionDisponibles[Math.floor(Math.random() * directionDisponibles.length)];
                        
                        switch (randomDirection) {
                            case 'up':
                                if(tab2[i - 1][j] === 's')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i - 1][j] = 'b';
                                }
                                else if(tab[i - 1][j] === 'j' )
                                {
                                    tab2[i][j] = 's';
                                    tab2[i - 1][j] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'down':
                                if(tab2[i + 1][j] === 's')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i + 1][j] = 'b';
                                }
                                else if(tab[i + 1][j] === 'j' )
                                {
                                    tab2[i][j] = 's';
                                    tab2[i + 1][j] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'left':
                                if(tab2[i][j-1] === 's')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i][j-1] = 'b';
                                }
                                else if(tab[i][j-1] === 'j')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i][j-1] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'right':
                                if(tab2[i][j+1] === 's')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i][j+1] = 'b';
                                }
                                else if(tab[i][j+1] === 'j')
                                {
                                    tab2[i][j] = 's';
                                    tab2[i][j+1] = 'b';
                                    GameOver();
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        tab = tab2;
    }
    

    //Deplacement vers le haut du joueur
    function MoveUpPlayer()
    {
        if(tab[positionJoueur[0]-1][positionJoueur[1]] === 's')
        {
            tab[positionJoueur[0]-1][positionJoueur[1]] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            positionJoueur[0] -= 1;
            MoveMonsters();
            Update();
        }
        else if(tab[positionJoueur[0]-1][positionJoueur[1]] === 't')
        {
            tab[positionJoueur[0]-1][positionJoueur[1]] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            nombretresors -= 1;
            positionJoueur[0] -= 1;
            score +=1;
            MoveMonsters();
            Gagner();
            Update();
        }
        else if(tab[positionJoueur[0]-1][positionJoueur[1]] === 'b')
        {
            GameOver();
        }
    }

    function MoveDownPlayer()
    {
        if(tab[positionJoueur[0]+1][positionJoueur[1]] === 's')
        {
            tab[positionJoueur[0]+1][positionJoueur[1]] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            positionJoueur[0] += 1;
            MoveMonsters();
            Update();
        }
        else if(tab[positionJoueur[0]+1][positionJoueur[1]] === 't')
        {
            tab[positionJoueur[0]+1][positionJoueur[1]] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            nombretresors -= 1;
            positionJoueur[0] += 1;
            score +=1;
            MoveMonsters();
            Gagner();
            Update();
        }
        else if(tab[positionJoueur[0]+1][positionJoueur[1]] === 'b')
        {
            GameOver();
        }
    }
    
    function MoveLeftPlayer()
    {
        if(tab[positionJoueur[0]][positionJoueur[1]-1] === 's')
        {
            tab[positionJoueur[0]][positionJoueur[1]-1] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            positionJoueur[1] -= 1;
            MoveMonsters();
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]-1] === 't')
        {
            tab[positionJoueur[0]][positionJoueur[1]-1] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            nombretresors -= 1;
            positionJoueur[1] -= 1;
            score +=1;
            MoveMonsters();
            Gagner();
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]-1] === 'p')
        {
            tab[positionJoueur[0]][positionJoueur[1]-1] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            nombretresors -= 1;
            positionJoueur[1] -= 1;
            score +=10;
            MoveMonsters();
            Gagner();
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]-1] === 'b')
        {
            GameOver();
        }
    }

    function MoveRightPlayer()
    {
        if(tab[positionJoueur[0]][positionJoueur[1]+1] === 's')
        {
            tab[positionJoueur[0]][positionJoueur[1]+1] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            positionJoueur[1] += 1;
            MoveMonsters();
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]+1] === 't')
        {
            tab[positionJoueur[0]][positionJoueur[1]+1] = 'j';
            tab[positionJoueur[0]][positionJoueur[1]] = 's';
            nombreCoups += 1;
            nombretresors -= 1;
            positionJoueur[1] += 1;
            score +=1;
            MoveMonsters();
            Gagner();
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]+1] === 'b')
        {
            GameOver();
        }
    }



    
    
//continue
                
});