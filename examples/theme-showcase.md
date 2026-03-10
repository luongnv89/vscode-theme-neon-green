# Neon Green Theme Showcase

Open this file in VS Code with the Neon Green theme to see how different token types are colorized across languages.

---

## JavaScript / TypeScript

```typescript
import { EventEmitter } from 'events';
import type { Config, Options } from './types';

// Constants and variables
const MAX_RETRIES = 3;
let isRunning = false;
const API_URL = "https://api.example.com";

// Interface and type alias
interface UserProfile {
  readonly id: number;
  name: string;
  email: string;
  roles: string[];
  metadata?: Record<string, unknown>;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

// Enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

// Generic class with decorators
class ApiClient<T extends object> extends EventEmitter {
  private baseUrl: string;
  protected timeout: number;

  constructor(config: Config) {
    super();
    this.baseUrl = config.url;
    this.timeout = config.timeout ?? 5000;
  }

  async fetchData<R>(endpoint: string, options?: Options): Promise<Result<R>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const retries = options?.retries ?? MAX_RETRIES;

    try {
      for (let i = 0; i < retries; i++) {
        const response = await fetch(url, {
          method: options?.method || 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data: R = await response.json();
          this.emit('success', { endpoint, data });
          return { success: true, data };
        }
      }
      throw new Error(`Failed after ${retries} retries`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  static create(url: string): ApiClient<Record<string, unknown>> {
    return new ApiClient({ url, timeout: 3000 });
  }
}

// Arrow functions & destructuring
const processUsers = (users: UserProfile[]): Map<number, string> => {
  const result = new Map<number, string>();
  for (const { id, name, ...rest } of users) {
    if (rest.roles.includes('admin')) {
      result.set(id, name.toUpperCase());
    }
  }
  return result;
};

// Template literals & regex
const validateEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

// Nullish coalescing, optional chaining, typeof
const getDisplayName = (user?: UserProfile | null): string => {
  return user?.name ?? (typeof user === 'undefined' ? 'Guest' : 'Anonymous');
};

// Spread, rest, satisfies
const defaults = { theme: 'dark', lang: 'en' } satisfies Record<string, string>;
const merged = { ...defaults, theme: 'neon-green' };

function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export { ApiClient, processUsers, validateEmail, Status };
export type { UserProfile, Result };
```

## Python

```python
"""Module docstring: Theme showcase for Python syntax highlighting."""

import os
import sys
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Generator, TypeVar, Generic
from functools import wraps
from enum import Enum, auto

T = TypeVar('T')
MAX_CONNECTIONS = 100
PI = 3.14159265

# Enum
class Priority(Enum):
    LOW = auto()
    MEDIUM = auto()
    HIGH = auto()
    CRITICAL = auto()

# Decorator
def retry(max_attempts: int = 3, delay: float = 1.0):
    """Retry decorator with configurable attempts and delay."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_error: Optional[Exception] = None
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except (ConnectionError, TimeoutError) as e:
                    last_error = e
                    await asyncio.sleep(delay * (2 ** attempt))
            raise last_error
        return wrapper
    return decorator

# Dataclass with generics
@dataclass
class CacheEntry(Generic[T]):
    key: str
    value: T
    ttl: int = 3600
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, object] = field(default_factory=dict)

    def is_expired(self) -> bool:
        import time
        return time.time() > self.ttl

    def __repr__(self) -> str:
        return f"CacheEntry(key={self.key!r}, expired={self.is_expired()})"

    def __hash__(self) -> int:
        return hash(self.key)

# Class with properties and class methods
class DatabasePool:
    _instance: Optional['DatabasePool'] = None
    _connections: List[object] = []

    def __init__(self, host: str, port: int = 5432, *, ssl: bool = True):
        self.host = host
        self.port = port
        self._ssl = ssl
        self._pool_size = 0

    @classmethod
    def get_instance(cls) -> 'DatabasePool':
        if cls._instance is None:
            cls._instance = cls("localhost")
        return cls._instance

    @staticmethod
    def validate_host(host: str) -> bool:
        import re
        pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$'
        return bool(re.match(pattern, host))

    @property
    def connection_string(self) -> str:
        proto = "postgresql+ssl" if self._ssl else "postgresql"
        return f"{proto}://{self.host}:{self.port}/db"

    @retry(max_attempts=5, delay=0.5)
    async def execute(self, query: str, params: tuple = ()) -> List[Dict]:
        """Execute a database query with automatic retry."""
        pass

# Generator & comprehensions
def fibonacci(n: int) -> Generator[int, None, None]:
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Lambda, map, filter
squares = list(map(lambda x: x ** 2, range(10)))
evens = [x for x in range(100) if x % 2 == 0]
lookup = {k: v for k, v in zip("abcdef", range(6))}

# Context manager & exception handling
async def process_file(path: str) -> None:
    try:
        async with aiofiles.open(path, mode='r') as f:
            content = await f.read()
            lines = content.splitlines()
            count = len(lines)
            print(f"Processed {count} lines from {path!r}")
    except FileNotFoundError:
        print(f"File not found: {path}", file=sys.stderr)
    except PermissionError as e:
        raise RuntimeError(f"Access denied: {e}") from e
    finally:
        print("Cleanup complete")

# Walrus operator & match statement (3.10+)
def classify(value: object) -> str:
    match value:
        case int(n) if n > 0:
            return "positive integer"
        case float(f) if f != f:  # NaN check
            return "not a number"
        case str(s) if (length := len(s)) > 100:
            return f"long string ({length} chars)"
        case None:
            return "nothing"
        case _:
            return "unknown"

if __name__ == "__main__":
    db = DatabasePool.get_instance()
    assert db is not None
    print(db.connection_string)
```

## Rust

```rust
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::fmt;

/// Configuration constants
const MAX_BUFFER_SIZE: usize = 1024 * 64;
const DEFAULT_TIMEOUT: f64 = 30.0;

/// Priority levels for task scheduling
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3,
}

/// A generic result wrapper
#[derive(Debug)]
struct TaskResult<T: fmt::Display> {
    value: T,
    priority: Priority,
    retries: u32,
    metadata: HashMap<String, String>,
}

/// Trait for executable tasks
trait Executable: Send + Sync {
    type Output: fmt::Display;
    type Error: std::error::Error;

    fn execute(&self) -> Result<Self::Output, Self::Error>;
    fn priority(&self) -> Priority {
        Priority::Medium
    }
}

/// Task scheduler implementation
struct Scheduler<'a, T: Executable + 'a> {
    tasks: Vec<&'a T>,
    results: Arc<Mutex<Vec<TaskResult<T::Output>>>>,
    max_concurrent: usize,
}

impl<'a, T: Executable + 'a> Scheduler<'a, T> {
    fn new(max_concurrent: usize) -> Self {
        Self {
            tasks: Vec::new(),
            results: Arc::new(Mutex::new(Vec::new())),
            max_concurrent,
        }
    }

    fn add_task(&mut self, task: &'a T) -> &mut Self {
        self.tasks.push(task);
        self
    }

    fn run(&self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut completed = 0_usize;

        for chunk in self.tasks.chunks(self.max_concurrent) {
            for task in chunk {
                match task.execute() {
                    Ok(value) => {
                        let result = TaskResult {
                            value,
                            priority: task.priority(),
                            retries: 0,
                            metadata: HashMap::new(),
                        };
                        self.results.lock().unwrap().push(result);
                        completed += 1;
                    }
                    Err(e) => {
                        eprintln!("Task failed: {}", e);
                    }
                }
            }
        }
        Ok(completed)
    }
}

// Macro for creating tasks
macro_rules! create_task {
    ($name:ident, $priority:expr, $body:block) => {
        struct $name;
        impl Executable for $name {
            type Output = String;
            type Error = Box<dyn std::error::Error>;
            fn execute(&self) -> Result<Self::Output, Self::Error> {
                $body
            }
            fn priority(&self) -> Priority {
                $priority
            }
        }
    };
}

create_task!(MyTask, Priority::High, {
    Ok(format!("Completed at buffer size: {}", MAX_BUFFER_SIZE))
});

fn main() {
    let mut scheduler = Scheduler::new(4);
    let task = MyTask;
    scheduler.add_task(&task);

    match scheduler.run() {
        Ok(n) => println!("Completed {} tasks", n),
        Err(e) => eprintln!("Scheduler error: {}", e),
    }
}
```

## Go

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

const (
	MaxRetries    = 3
	DefaultPort   = 8080
	ReadTimeout   = 15 * time.Second
	WriteTimeout  = 10 * time.Second
)

// Service represents an HTTP API service
type Service struct {
	mu       sync.RWMutex
	handlers map[string]http.HandlerFunc
	port     int
	logger   *log.Logger
}

// Response is a generic API response
type Response[T any] struct {
	Data    T      `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
	Status  int    `json:"status"`
}

// Middleware defines an HTTP middleware function
type Middleware func(http.HandlerFunc) http.HandlerFunc

// NewService creates a new Service instance
func NewService(port int) *Service {
	return &Service{
		handlers: make(map[string]http.HandlerFunc),
		port:     port,
		logger:   log.Default(),
	}
}

// Use applies middleware to a handler
func (s *Service) Use(pattern string, handler http.HandlerFunc, mw ...Middleware) {
	wrapped := handler
	for i := len(mw) - 1; i >= 0; i-- {
		wrapped = mw[i](wrapped)
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.handlers[pattern] = wrapped
}

// LoggingMiddleware logs request details
func LoggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next(w, r)
		duration := time.Since(start)
		log.Printf("[%s] %s %s (%v)", r.Method, r.URL.Path, r.RemoteAddr, duration)
	}
}

// WriteJSON sends a JSON response
func WriteJSON[T any](w http.ResponseWriter, status int, data T) error {
	resp := Response[T]{Data: data, Status: status}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(resp)
}

// FetchWithRetry performs HTTP requests with retry logic
func FetchWithRetry(ctx context.Context, url string) ([]byte, error) {
	var lastErr error

	for i := 0; i < MaxRetries; i++ {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
		if err != nil {
			return nil, fmt.Errorf("creating request: %w", err)
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			lastErr = err
			time.Sleep(time.Duration(i+1) * time.Second)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			var buf []byte
			buf, err = io.ReadAll(resp.Body)
			return buf, err
		}
		lastErr = fmt.Errorf("status %d", resp.StatusCode)
	}

	return nil, fmt.Errorf("after %d retries: %w", MaxRetries, lastErr)
}

func main() {
	svc := NewService(DefaultPort)
	svc.Use("/api/health", func(w http.ResponseWriter, r *http.Request) {
		WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	}, LoggingMiddleware)

	addr := fmt.Sprintf(":%d", DefaultPort)
	fmt.Printf("Server listening on %s\n", addr)

	srv := &http.Server{
		Addr:         addr,
		ReadTimeout:  ReadTimeout,
		WriteTimeout: WriteTimeout,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
```

## React / JSX

```tsx
import React, { useState, useEffect, useCallback, useMemo, type FC } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

type FilterMode = 'all' | 'active' | 'completed';

const PRIORITIES = ['low', 'medium', 'high'] as const;

const PriorityBadge: FC<{ priority: Todo['priority'] }> = ({ priority }) => {
  const colors: Record<typeof priority, string> = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  };

  return (
    <span
      className="priority-badge"
      style={{ backgroundColor: colors[priority], color: '#fff' }}
      data-testid={`badge-${priority}`}
    >
      {priority.toUpperCase()}
    </span>
  );
};

const TodoApp: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectedPriority, setSelectedPriority] = useState<Todo['priority']>('medium');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Todo[];
        setTodos(parsed.map(t => ({ ...t, createdAt: new Date(t.createdAt) })));
      } catch {
        console.error('Failed to parse saved todos');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: trimmed,
      completed: false,
      priority: selectedPriority,
      createdAt: new Date(),
    };

    setTodos(prev => [newTodo, ...prev]);
    setInput('');
  }, [input, selectedPriority]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          aria-label="New todo input"
        />
        <select
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value as Todo['priority'])}
        >
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button onClick={addTodo} disabled={!input.trim()}>
          Add
        </button>
      </div>

      <div className="filters">
        {(['all', 'active', 'completed'] as FilterMode[]).map(mode => (
          <button
            key={mode}
            className={filter === mode ? 'active' : ''}
            onClick={() => setFilter(mode)}
          >
            {mode} ({mode === 'all' ? stats.total : stats[mode]})
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="title">{todo.title}</span>
            <PriorityBadge priority={todo.priority} />
            <button onClick={() => deleteTodo(todo.id)}>&times;</button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="empty-state">
          {filter === 'all' ? 'No todos yet!' : `No ${filter} todos`}
        </p>
      )}
    </div>
  );
};

export default TodoApp;
```

## CSS / SCSS

```scss
// Variables
$primary: #39ff14;
$bg-dark: #0a0f0a;
$font-stack: 'JetBrains Mono', 'Fira Code', monospace;
$border-radius: 8px;
$transition-speed: 200ms;

// Mixin
@mixin flex-center($direction: row, $gap: 1rem) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
  gap: $gap;
}

// Keyframes
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba($primary, 0.3); }
  50% { box-shadow: 0 0 20px rgba($primary, 0.6); }
}

// Base styles
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: $font-stack;
  background-color: $bg-dark;
  color: #c8d6c8;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

// Component
.todo-app {
  max-width: 640px;
  margin: 2rem auto;
  padding: 2rem;

  h1 {
    color: $primary;
    font-size: 2rem;
    text-align: center;
    text-shadow: 0 0 10px rgba($primary, 0.5);
  }

  .input-section {
    @include flex-center(row, 0.5rem);
    margin-top: 1.5rem;

    input[type="text"] {
      flex: 1;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba($primary, 0.3);
      border-radius: $border-radius;
      color: inherit;
      font-size: 1rem;
      transition: border-color $transition-speed ease;

      &:focus {
        outline: none;
        border-color: $primary;
        animation: glow 2s infinite;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    button {
      padding: 0.75rem 1.5rem;
      background: $primary;
      color: $bg-dark;
      border: none;
      border-radius: $border-radius;
      font-weight: 700;
      cursor: pointer;
      transition: all $transition-speed ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($primary, 0.4);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }

  .todo-list {
    list-style: none;
    margin-top: 1rem;

    li {
      @include flex-center(row, 0.75rem);
      justify-content: flex-start;
      padding: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      transition: background $transition-speed;

      &:hover {
        background: rgba($primary, 0.04);
      }

      &.completed .title {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }
  }

  // Priority badge
  .priority-badge {
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

// Media query
@media (max-width: 768px) {
  .todo-app {
    padding: 1rem;

    .input-section {
      flex-direction: column;

      input[type="text"],
      button {
        width: 100%;
      }
    }
  }
}

// Utility classes
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
```

## HTML

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Neon Green Theme Showcase" />
  <title>Theme Showcase &mdash; Neon Green</title>
  <link rel="stylesheet" href="/styles/main.css" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <script type="module" src="/scripts/app.js" defer></script>
</head>
<body>
  <header class="site-header" role="banner">
    <nav aria-label="Main navigation">
      <a href="/" class="logo">&#9889; Neon Green</a>
      <ul class="nav-links">
        <li><a href="/docs">Docs</a></li>
        <li><a href="/examples">Examples</a></li>
        <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
    </nav>
  </header>

  <main id="content">
    <section class="hero">
      <h1>Build with <em>Neon Green</em></h1>
      <p>A high&#8209;contrast VS&nbsp;Code theme for focused coding.</p>
      <div class="cta-group">
        <button type="button" onclick="install()" data-action="install">
          Install Theme
        </button>
        <a href="#preview" class="btn-secondary">Preview &darr;</a>
      </div>
    </section>

    <section id="preview" aria-labelledby="preview-heading">
      <h2 id="preview-heading">Live Preview</h2>
      <figure>
        <img
          src="/images/screenshot.png"
          alt="Screenshot of Neon Green theme in VS Code"
          width="1200"
          height="800"
          loading="lazy"
        />
        <figcaption>Dark Terminal variant with TypeScript</figcaption>
      </figure>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 Neon Green Theme. MIT License.</p>
  </footer>
</body>
</html>
```

## JSON

```json
{
  "name": "neon-green-theme",
  "version": "2.1.0",
  "description": "A neon green VS Code color theme",
  "categories": ["Themes"],
  "engines": {
    "vscode": "^1.80.0"
  },
  "contributes": {
    "themes": [
      {
        "label": "Neon Green - Dark Terminal",
        "uiTheme": "vs-dark",
        "path": "./themes/neon-green-color-theme.json"
      },
      {
        "label": "Neon Green - Light",
        "uiTheme": "vs",
        "path": "./themes/neon-green-light-color-theme.json"
      }
    ]
  },
  "keywords": ["theme", "dark", "neon", "green", "high-contrast"],
  "repository": {
    "type": "git",
    "url": "https://github.com/example/neon-green-theme"
  },
  "bugs": {
    "url": "https://github.com/example/neon-green-theme/issues"
  },
  "pricing": "Free",
  "preview": false
}
```

## YAML

```yaml
# Docker Compose configuration
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    image: neon-green-app:latest
    container_name: neon-app
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "9229:9229"  # debug port
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/appdb
      REDIS_URL: redis://cache:6379
      LOG_LEVEL: info
      NODE_ENV: production
    volumes:
      - app-data:/app/data
      - ./config:/app/config:ro
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - backend
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    networks:
      - backend

volumes:
  app-data:
  pgdata:

networks:
  backend:
    driver: bridge
```

## Shell / Bash

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="/tmp/deploy-$(date +%Y%m%d-%H%M%S).log"
readonly MAX_RETRIES=3
readonly VERSION="2.1.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $*" | tee -a "$LOG_FILE"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "$LOG_FILE"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2 | tee -a "$LOG_FILE"; }

# Usage
usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] <command>

Commands:
    deploy      Deploy the application
    rollback    Rollback to previous version
    status      Show deployment status

Options:
    -e, --env       Environment (dev|staging|prod)
    -t, --tag       Docker image tag
    -v, --verbose   Enable verbose output
    -h, --help      Show this help
    --dry-run       Simulate without making changes

Version: ${VERSION}
EOF
    exit 0
}

# Parse arguments
ENV="dev"
TAG="latest"
VERBOSE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -e|--env)     ENV="$2"; shift 2 ;;
        -t|--tag)     TAG="$2"; shift 2 ;;
        -v|--verbose) VERBOSE=true; shift ;;
        --dry-run)    DRY_RUN=true; shift ;;
        -h|--help)    usage ;;
        deploy|rollback|status)
            COMMAND="$1"; shift ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate environment
validate_env() {
    local env="$1"
    case "$env" in
        dev|staging|prod) return 0 ;;
        *)
            log_error "Invalid environment: ${env}"
            return 1
            ;;
    esac
}

# Deploy function with retry
deploy() {
    local attempt=0

    validate_env "$ENV" || exit 1
    log_info "Deploying version ${TAG} to ${ENV}..."

    while (( attempt < MAX_RETRIES )); do
        ((attempt++))
        log_info "Attempt ${attempt}/${MAX_RETRIES}"

        if docker pull "myapp:${TAG}" 2>/dev/null; then
            if [[ "$DRY_RUN" == true ]]; then
                log_warn "DRY RUN: Would deploy myapp:${TAG} to ${ENV}"
                return 0
            fi

            docker-compose -f "${SCRIPT_DIR}/docker-compose.${ENV}.yml" \
                up -d --force-recreate

            log_info "Deployment successful!"
            return 0
        fi

        log_warn "Attempt ${attempt} failed, retrying in $((attempt * 5))s..."
        sleep $((attempt * 5))
    done

    log_error "Deployment failed after ${MAX_RETRIES} attempts"
    return 1
}

# Health check
check_health() {
    local url="http://localhost:3000/health"
    local status

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

    if [[ "$status" == "200" ]]; then
        log_info "Health check passed (HTTP ${status})"
    else
        log_error "Health check failed (HTTP ${status})"
        return 1
    fi
}

# Main
main() {
    log_info "Starting ${COMMAND:-deploy} at $(date)"

    case "${COMMAND:-deploy}" in
        deploy)   deploy && check_health ;;
        rollback) log_warn "Rollback not yet implemented" ;;
        status)   check_health ;;
    esac

    log_info "Done!"
}

main "$@"
```

## SQL

```sql
-- Create tables with constraints
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    CHAR(60) NOT NULL,
    role        VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE posts (
    id          SERIAL PRIMARY KEY,
    author_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    slug        VARCHAR(220) NOT NULL UNIQUE,
    content     TEXT,
    status      VARCHAR(20) DEFAULT 'draft',
    view_count  INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status) WHERE status = 'published';

-- Complex query with CTE, window functions, and aggregation
WITH monthly_stats AS (
    SELECT
        u.id AS user_id,
        u.username,
        DATE_TRUNC('month', p.published_at) AS month,
        COUNT(p.id) AS post_count,
        SUM(p.view_count) AS total_views,
        AVG(p.view_count)::NUMERIC(10,2) AS avg_views
    FROM users u
    INNER JOIN posts p ON u.id = p.author_id
    WHERE p.status = 'published'
      AND p.published_at >= NOW() - INTERVAL '12 months'
    GROUP BY u.id, u.username, DATE_TRUNC('month', p.published_at)
),
ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY month ORDER BY total_views DESC) AS rank,
        LAG(total_views) OVER (PARTITION BY user_id ORDER BY month) AS prev_views
    FROM monthly_stats
)
SELECT
    username,
    month,
    post_count,
    total_views,
    avg_views,
    rank,
    CASE
        WHEN prev_views IS NULL THEN 'N/A'
        WHEN total_views > prev_views THEN '+' || (total_views - prev_views)::TEXT
        WHEN total_views < prev_views THEN '-' || (prev_views - total_views)::TEXT
        ELSE 'unchanged'
    END AS trend
FROM ranked
WHERE rank <= 5
ORDER BY month DESC, rank ASC;

-- Stored procedure
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET updated_at = NOW()
    WHERE id = NEW.author_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_update
    AFTER INSERT OR UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_stats();
```

## C / C++

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>
#include <functional>
#include <string>
#include <unordered_map>

#define MAX_ELEMENTS 1024
#define LOG(msg) std::cerr << "[LOG] " << msg << std::endl

namespace neon::core {

// Forward declaration
template<typename T>
class EventEmitter;

// Enum class
enum class LogLevel : uint8_t {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4,
};

// Struct
struct Config {
    std::string host;
    int port = 8080;
    bool ssl = true;
    LogLevel level = LogLevel::Info;
};

// Abstract base class
class IHandler {
public:
    virtual ~IHandler() = default;
    virtual void handle(const std::string& event) = 0;
    virtual std::string name() const = 0;
};

// Template class
template<typename T>
class EventEmitter {
public:
    using Callback = std::function<void(const T&)>;

    void on(const std::string& event, Callback cb) {
        listeners_[event].push_back(std::move(cb));
    }

    void emit(const std::string& event, const T& data) {
        auto it = listeners_.find(event);
        if (it != listeners_.end()) {
            for (const auto& cb : it->second) {
                cb(data);
            }
        }
    }

    [[nodiscard]] size_t listener_count(const std::string& event) const {
        auto it = listeners_.find(event);
        return it != listeners_.end() ? it->second.size() : 0;
    }

private:
    std::unordered_map<std::string, std::vector<Callback>> listeners_;
};

// Derived class
class Server : public IHandler {
public:
    explicit Server(Config config)
        : config_(std::move(config))
        , emitter_(std::make_unique<EventEmitter<std::string>>())
    {
        LOG("Server created on port " + std::to_string(config_.port));
    }

    void handle(const std::string& event) override {
        emitter_->emit("request", event);
        request_count_++;
    }

    std::string name() const override { return "Server"; }

    void start() {
        auto* self = this;
        emitter_->on("request", [self](const std::string& data) {
            LOG("Handling: " + data);
        });
        running_ = true;
    }

    [[nodiscard]] bool is_running() const { return running_; }

private:
    Config config_;
    std::unique_ptr<EventEmitter<std::string>> emitter_;
    size_t request_count_ = 0;
    bool running_ = false;
};

} // namespace neon::core

int main(int argc, char* argv[]) {
    using namespace neon::core;

    Config cfg{.host = "0.0.0.0", .port = 3000, .ssl = true};
    auto server = std::make_unique<Server>(std::move(cfg));

    server->start();

    std::vector<std::string> events = {"GET /", "POST /api", "GET /health"};

    std::for_each(events.begin(), events.end(),
        [&server](const auto& e) { server->handle(e); });

    std::cout << "Server running: " << std::boolalpha
              << server->is_running() << std::endl;

    return 0;
}
```

## Java

```java
package com.example.neongreen;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;
import java.util.function.*;

/**
 * Showcase of Java syntax highlighting.
 */
public sealed interface Result<T> permits Result.Success, Result.Failure {

    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String error, Exception cause) implements Result<T> {}

    default boolean isSuccess() {
        return this instanceof Success;
    }

    default <R> Result<R> map(Function<T, R> mapper) {
        return switch (this) {
            case Success<T> s -> new Success<>(mapper.apply(s.value()));
            case Failure<T> f -> new Failure<>(f.error(), f.cause());
        };
    }
}

@FunctionalInterface
interface AsyncTask<T> {
    CompletableFuture<Result<T>> execute();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface Retry {
    int maxAttempts() default 3;
    long delayMs() default 1000;
}

class TaskScheduler {
    private static final int MAX_POOL_SIZE = 16;
    private static final long TIMEOUT_MS = 30_000L;

    private final ExecutorService executor;
    private final Map<String, CompletableFuture<?>> activeTasks;

    public TaskScheduler(int poolSize) {
        this.executor = Executors.newFixedThreadPool(
            Math.min(poolSize, MAX_POOL_SIZE)
        );
        this.activeTasks = new ConcurrentHashMap<>();
    }

    @Retry(maxAttempts = 5, delayMs = 500)
    public <T> CompletableFuture<Result<T>> submit(
            String taskId,
            AsyncTask<T> task,
            Duration timeout
    ) {
        var future = task.execute()
            .orTimeout(timeout.toMillis(), TimeUnit.MILLISECONDS)
            .exceptionally(ex -> new Result.Failure<>(
                "Task failed: " + ex.getMessage(),
                ex instanceof Exception e ? e : new RuntimeException(ex)
            ));

        activeTasks.put(taskId, future);
        future.whenComplete((result, throwable) -> activeTasks.remove(taskId));

        return future;
    }

    public Map<String, Object> getStats() {
        return Map.of(
            "activeTasks", activeTasks.size(),
            "poolSize", MAX_POOL_SIZE,
            "isShutdown", executor.isShutdown()
        );
    }

    public void shutdown() throws InterruptedException {
        executor.shutdown();
        if (!executor.awaitTermination(TIMEOUT_MS, TimeUnit.MILLISECONDS)) {
            var pending = executor.shutdownNow();
            System.err.printf("Forced shutdown, %d tasks cancelled%n", pending.size());
        }
    }

    public static void main(String[] args) throws Exception {
        var scheduler = new TaskScheduler(4);

        List<String> ids = List.of("task-1", "task-2", "task-3");

        var futures = ids.stream()
            .map(id -> scheduler.submit(
                id,
                () -> CompletableFuture.supplyAsync(() -> {
                    double value = Math.random() * 100;
                    return new Result.Success<>(String.format("%.2f", value));
                }),
                Duration.ofSeconds(10)
            ))
            .toList();

        CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();

        futures.forEach(f -> {
            try {
                var result = f.get();
                System.out.println(result.isSuccess() ? "OK" : "FAIL");
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        scheduler.shutdown();
    }
}
```
