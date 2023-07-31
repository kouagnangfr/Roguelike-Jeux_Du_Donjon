document.addEventListener("DOMContentLoaded", function () 
{
    //grille de depart
    var tab =   [   ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','t','s','s','s','m','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','s','s','m','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','m','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','b','s','s','s','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','s','s','s','s','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','m','m','m','s','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','s','s','m','s','m','m','m','s','m','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','t','s','s','s','s','m','m','m','s','s','m','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','s','s','s','m','m','m','m','m','s','s','s','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','b','s','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','m','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','s','s','j','m','m','m'],
                    ['m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m','m']   
                ];
    const tab2 = tab;
    let positionJoueur = [13,21];
    let positionMonstre1 = [5,16];
    let positionMonstre2 = [19,19];
    let nombreMonstres = 2;
    let nombretresors = 2;
    let nombreCoups = 0;
    let score = 0;
    let temps
    let time = 0;

    //Creation de la grille de jeu de depart
    function createGrid() 
    {
        const gridContainer = document.getElementById("gridContainer");
        for (let i = 0; i < tab.length; i++)
        {
            for (let j = 0; j < tab[i].length; j++) 
            {
                const gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");

                // Définir la couleur en fonction de la lettre dans le tableau
                switch (tab[i][j]) 
                {
                    case 'j':
                        gridItem.style.backgroundColor = "red";
                        break;
                    case 's':
                        gridItem.style.backgroundColor = "white";
                        break;
                    case 'b':
                        gridItem.style.backgroundColor = "green";
                        break;
                    case 't':
                        gridItem.style.backgroundColor = "yellow";
                        break;
                    default:
                        gridItem.style.backgroundColor = "black"; 
                }
                gridContainer.appendChild(gridItem);
            }
        }
    }


    //Temps ecouler
    function UpdateTime() {
        temps = document.getElementById("time");
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        temps.textContent = "" + minutes + "m " + seconds + " s";
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
        UpdateTime();
        
    }

    createGrid();

    //reinitialisation du jeu
    function Reinitialiser()
    {
        location.reload();  
    }

    function Restart()
    {
        Reinitialiser();
        Update();
        const divGameOver = document.getElementById("gameOver");
        divGameOver.style.display = "none";
    }

    //Partie perdue
    function GameOver()
    {
        const divGameOver = document.getElementById("gameOver");
        divGameOver.style.display = "block";
        clearInterval();
    }

    //Deplacement du monstre
    function MoveMonsters() 
    {
        // Pour chaque case verte (représentée par 'b') sur la grille
        for (let i = 0; i < tab.length; i++) {
            for (let j = 0; j < tab[i].length; j++) {
                if (tab[i][j] === 'b') 
                {
                    //Verification des directions disponibles
                    const directionDisponibles = []; 
                    if (tab[i - 1][j] === 's' || tab[i - 1][j] === 's')
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
                                if(tab[i - 1][j] === 's')
                                {
                                    tab[i][j] = 's';
                                    tab[i - 1][j] = 'b';
                                }
                                else if(tab[i - 1][j] === 'j' )
                                {
                                    tab[i][j] = 's';
                                    tab[i - 1][j] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'down':
                                if(tab[i + 1][j] === 's')
                                {
                                    tab[i][j] = 's';
                                    tab[i + 1][j] = 'b';
                                }
                                else if(tab[i + 1][j] === 'j' )
                                {
                                    tab[i][j] = 's';
                                    tab[i + 1][j] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'left':
                                if(tab[i][j-1] === 's')
                                {
                                    tab[i][j] = 's';
                                    tab[i][j-1] = 'b';
                                }
                                else if(tab[i][j-1] === 'j')
                                {
                                    tab[i][j] = 's';
                                    tab[i][j-1] = 'b';
                                    GameOver();
                                }
                                break;
                            case 'right':
                                if(tab[i][j+1] === 's')
                                {
                                    tab[i][j] = 's';
                                    tab[i][j+1] = 'b';
                                }
                                else if(tab[i][j+1] === 'j')
                                {
                                    tab[i][j] = 's';
                                    tab[i][j+1] = 'b';
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
            Update();
        }
        else if(tab[positionJoueur[0]][positionJoueur[1]+1] === 'b')
        {
            GameOver();
        }
    }


    //Gestion des evenements des boutons
    document.getElementById("Up").addEventListener("click", MoveUpPlayer);
    document.getElementById("Down").addEventListener("click", MoveDownPlayer);
    document.getElementById("Left").addEventListener("click", MoveLeftPlayer);
    document.getElementById("Right").addEventListener("click", MoveRightPlayer);
    document.getElementById("Reinitialiser").addEventListener("click", Reinitialiser);
    document.getElementById("Button-rejouer").addEventListener("click",Restart);


    
    
//continue
                
});