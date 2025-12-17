"use client";

import { SetStateAction, useEffect, useState } from 'react';


function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function TestInput() {
  const [res, setRes] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1", {method: "POST",headers: {
      "Content-Type": "application/json",
    },body: "{'a': 1}"})
      .then((res) => res.json())
      .then((json) => setRes(json))
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      
      <p>You typed: {value}</p>
    </div>
  );
}

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: SetStateAction<number>) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function fetchUsers() {
    fetch('http://localhost:5000/getusers')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }

  function addUser() {
    const user = { name, email, password };
    fetch('http://localhost:5000/adduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]);
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function deleteUser(id: string) {
    return () => {
      fetch(`http://localhost:5000/deleteuser/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setUsers(users.filter((user) => user._id !== id));
            console.log('User deleted successfully');
          } else {
            console.error('Failed to delete user');
          } 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  }

  function updateUser(id: string) {
    return () => {
      fetch(`http://localhost:5000/updateuser/${id}`, {
        method: 'PUT',
      })
        .then((response) => {
          if (response.ok) {
            const index = users.findIndex((user) => user._id == id);
            const updatedUsers = [...users];
            updatedUsers[index].name = 'Updated Name';
            setUsers(updatedUsers);
            console.log('User updated successfully');
          } else {
            console.error('Failed to update user');
          } 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  }

  return (
    
    <div className="d-flex" style={{flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <div className='welcome'>
      Welcome to Avinash's React App.
      </div>
      <div className='input'>
        <TestInput />
      </div>

      <br></br>
      <br></br>

      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>  

      <br></br>
      <br></br>

      <div className='Users'>
        <h1>Users List</h1>
        {users.map((user: { _id: string; name: string; email: string }) => (
          <div key={user._id} style={{padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <p style={{paddingRight: 10}}>
              {user.name} - {user.email} 
            </p>
            
            <button onClick={deleteUser(user._id)}>Delete User</button>
          </div>
        ))}

        <h2>Add New User</h2>

        <div className='d-flex'>
          <input style={{margin: 10}} type="text" placeholder="name" onChange={(e) => setName(e.target.value)} /> 
          <input style={{margin: 10}} type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
          <input style={{margin: 10}} type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={addUser}>Add User</button>
        </div>
      </div>
    </div>
  );
}


