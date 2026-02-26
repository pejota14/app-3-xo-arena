import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../settings/settings.component';
import { AdsService } from '../../services/ads/ads.service';

type Player = 'X' | 'O' | null;
type GameMode = 'PVP' | 'AI';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SettingsComponent
  ],
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent {

  board: Player[] = Array(9).fill(null);
  currentPlayer: Player = 'X';
  winner: Player = null;
  isDraw = false;

  gameMode: GameMode = 'PVP';
  difficulty: Difficulty = 'EASY';

  humanPlayer: Exclude<Player, null> = 'X';
  aiPlayer: Exclude<Player, null> = 'O';

  gamesCount = signal(0);

  winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  constructor(private ads: AdsService) {
    this.gamesCount.set(Number(localStorage.getItem('gamesPlayed')) || 0);
  }

  makeMove(index: number): void {
    if (this.board[index] || this.winner || this.isDraw) return;

    if (this.gameMode === 'AI' && this.currentPlayer !== this.humanPlayer) return;

    this.board[index] = this.currentPlayer;
    this.evaluateGame();
    if (this.winner || this.isDraw) return;

    if (this.gameMode === 'AI') {
      this.currentPlayer = this.aiPlayer;
      setTimeout(() => this.aiMove(), 300);
    } else {
      this.togglePlayer();
    }
  }

  togglePlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  evaluateGame(): void {
    for (const combo of this.winningCombos) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        return;
      }
    }

    if (!this.board.includes(null)) {
      this.isDraw = true;
    }
  }

  resetGame(): void {
    if (this.gamesCount() % 10 === 0) {
      this.ads.showInterstitial().finally(() => {
        this.startTimeout();
      });
    } else {
      this.startTimeout();
    }
    this.gamesCount.update(v => v + 1);
    localStorage.setItem('gamesPlayed', String(this.gamesCount()));
  }

  private startTimeout() {
    const boardElement = document.querySelector('.board');
    boardElement?.classList.add('erasing');
    setTimeout(() => {
      this.board = Array(9).fill(null);
      this.winner = null;
      this.isDraw = false;

      if (this.gameMode === 'AI') {
        this.assignRandomRolesAndMaybeStart();
      } else {
        this.currentPlayer = 'X';
      }

      boardElement?.classList.remove('erasing');
    }, 300);
  }

  private assignRandomRolesAndMaybeStart(): void {
    // Randomize what the human plays
    this.humanPlayer = Math.random() < 0.5 ? 'X' : 'O';
    this.aiPlayer = this.humanPlayer === 'X' ? 'O' : 'X';

    // X ALWAYS starts
    this.currentPlayer = 'X';

    // If human is O, AI is X and must start immediately
    if (this.currentPlayer === this.aiPlayer) {
      setTimeout(() => this.aiMove(), 300);
    }
  }
  /* =====================
        AI SECTION
     ===================== */

  aiMove(): void {
    if (this.winner || this.isDraw) return;

    let moveIndex: number;

    switch (this.difficulty) {
      case 'EASY':
        moveIndex = this.randomMove();
        break;
      case 'MEDIUM':
        moveIndex = Math.random() < 0.5
          ? this.randomMove()
          : this.minimax([...this.board], this.aiPlayer).index!;
        break;
      case 'HARD':
      default:
        moveIndex = this.minimax([...this.board], this.aiPlayer).index!;
        break;
    }

    this.board[moveIndex] = this.aiPlayer;
    this.evaluateGame();
    if (this.winner || this.isDraw) return;

    this.currentPlayer = this.humanPlayer;
  }

  minimax(board: Player[], player: Exclude<Player, null>): any {
    const availableSpots = board
      .map((v, i) => (v === null ? i : null))
      .filter(v => v !== null) as number[];

    // NEW: score relative to current roles
    if (this.checkWin(board, this.humanPlayer)) return { score: -10 };
    if (this.checkWin(board, this.aiPlayer)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves: any[] = [];

    for (const spot of availableSpots) {
      const move: any = { index: spot };
      board[spot] = player;

      const nextPlayer = player === this.aiPlayer ? this.humanPlayer : this.aiPlayer;
      const result = this.minimax(board, nextPlayer);

      move.score = result.score;
      board[spot] = null;
      moves.push(move);
    }

    let bestMove = 0;

    if (player === this.aiPlayer) {
      let bestScore = -Infinity;
      moves.forEach((m, i) => {
        if (m.score > bestScore) {
          bestScore = m.score;
          bestMove = i;
        }
      });
    } else {
      let bestScore = Infinity;
      moves.forEach((m, i) => {
        if (m.score < bestScore) {
          bestScore = m.score;
          bestMove = i;
        }
      });
    }

    return moves[bestMove];
  }

  randomMove(): number {
    const available = this.board
      .map((v, i) => (v === null ? i : null))
      .filter((v): v is number => v !== null);

    if (!available.length) return -1;

    return available[Math.floor(Math.random() * available.length)];
  }

  checkWin(board: Player[], player: Player): boolean {
    return this.winningCombos.some(combo =>
      combo.every(index => board[index] === player)
    );
  }
}