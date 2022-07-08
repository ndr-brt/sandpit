use crossbeam_channel::{unbounded, Sender, Receiver};
use std::thread;
use tauri::api::process::{Command, CommandEvent};
use tauri::{Window};
use std::fs::File;
use std::io::{self, BufRead};

pub struct Tidal {
    is_running: bool,
    sink: Sender<String>,
    stream: Receiver<String>
}

impl Tidal {
    pub fn new() -> Tidal {
        let (ghci_sink, ghci_stream) = unbounded::<String>();

        return Tidal { is_running: false, sink: ghci_sink, stream: ghci_stream };
    }

    pub fn send_line(&self, line: String) {
        println!("==> {}", line);
        self.sink.send((line + "\n").to_string());
    }

    pub fn is_running(&self) -> bool {
        return self.is_running;
    }

    pub fn start(&mut self, window: Window, boot_tidal_path: String) {

        let stream_clone = self.stream.clone();

        tauri::async_runtime::spawn(async move {
          let (mut rx, mut child) = Command::new("ghci")
            .spawn()
            .expect("Failed to spawn ghci");
        
          thread::spawn(move || {
            loop {
              if let Ok(line) = stream_clone.try_recv() {
                child.write((line + "\n").as_bytes());
              }
            }
          });
      
          while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
              println!("t> {}", line);
              window.emit("log", line).unwrap();
            }
          }
        });


        let file = File::open(boot_tidal_path).expect("Cannot find tidal boot file");
        let lines = io::BufReader::new(file).lines();
        for line in lines {
            if let Ok(value) = line {
                self.send_line(value);
            }
        }
        self.is_running = true;
    }
}