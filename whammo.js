// LOGIC

var deck = [
    '2C','3C','4C','5C','6C','7C','8C','9C','TC','JC','QC','KC','AC',
    '2H','3H','4H','5H','6H','7H','8H','9H','TH','JH','QH','KH','AH',
    '2S','3S','4S','5S','6S','7S','8S','9S','TS','JS','QS','KS','AS',
    '2D','3D','4D','5D','6D','7D','8D','9D','TD','JD','QD','KD','AD',
    '1J', '2J'
];

var players = [];
var last_hand = [];
var pile = [];
var turn = 0;

/* * 0: Init * 1: Game * 2: Whammo */
var INIT = 0; var GAME = 1; var WHAMMO = 2;
var game_state = INIT;

/*
 * Add a player to the game
 */
function addPlayer(player) {
    if(game_state == INIT) {
        players.push(player);
        return true;
    } else {
        return false;
    }
}

/*
 * Player constructor 
 */
function Player(id, name, hand) {
  this.id = id;
  this.name = name;
  this.hand = hand;
  this.selected = [];
}

/*
 * Deal
 */
function deal() {
    if(game_state != INIT) 
        return false;

    // Start game
    game_state = GAME;
    // Give each player 5 cards
    players.forEach((player, index) => {
        var hand = [];
        for(x = 0; x<5; x++) {
            hand.push(takeFromDeck());
        }
        players[index].hand = hand;
    });
}

/*
 * Take from top of deck
 */
function takeFromDeck() {
    // If deck is empty get pile
    if(deck.length == 0) {
        var tmp = pile.pop(); // Remove top card
        deck = pile;
        pile = tmp;
    }

    var random = Math.floor(Math.random()*deck.length);
    var card = deck[random];
    deck.splice(random, 1);
    return card;
}

/*
 * Total in hand
 */
function totalHand(hand) {
    var total = 0;
    hand.forEach((card, index) => {
        total += parseInt(parseCard(card).match(/\d+/)[0]);
    });

    return total;
}

/*
 * Play cards
 */
function playCards(player, cards) {
    if(player != turn) {
        return false;
    }

    if(!validateCards(cards)) 
        return false;

    last_hand = cards;

    cards.forEach((card, index) => {
        pile.push(card);
    });

    turn = (turn + 1) % players.length;
    return true;
}

/*
 * Validate cards
 */
function validateCards(cards) {
    // Check length
    if(cards.length == 0) {
        return false;
    }

    // Check for single/pair/trips/quads
    cards = cards.map((card) => {
        return parseInt(parseCard(card).match(/\d+/)[0]);
    });
    if(cards.every(card => {
        
        // Don't compare with jokers
        if(cards[0] != "25") {
            return (card == cards[0] || card == "25");
        } else if(cards[1] != "25") {
            return (card == cards[1] || card == "25");
        } else {
            return (card == cards[2] || card == "25");
        }

    })) {
        return true;
    }

    return false;
}

/*
 * Parse card
 */
function parseCard(card) {
    var tmp = card;
    tmp = tmp.replace("1J", "25");
    tmp = tmp.replace("2J", "25");
    tmp = tmp.replace("T", "10");
    tmp = tmp.replace("J", "11");
    tmp = tmp.replace("Q", "12");
    tmp = tmp.replace("K", "13");
    tmp = tmp.replace("A", "1");
    
    return tmp;
}
