use crossbeam_channel::{unbounded, Sender, Receiver};
use std::thread;
use tauri::api::process::{Command, CommandEvent};
use tauri::{Window};

pub struct Tidal {
    is_running: bool,
    sink: Sender<String>,
    stream: Receiver<String>
}

#[derive(Clone, serde::Serialize)]
struct LogPayload {
  message: String,
  level: String
}

impl Tidal {
    pub fn new() -> Tidal {
        let (ghci_sink, ghci_stream) = unbounded::<String>();

        return Tidal { is_running: false, sink: ghci_sink, stream: ghci_stream };
    }

    pub fn send_code(&self, code: String) {
        println!("==> {}", code);
        self.sink.send(":{".to_string())
          .and_then(|_| { self.sink.send((code + "\n").to_string()) })
          .and_then(|_| { self.sink.send(":}".to_string()) })
          .expect("Error sending a code block to tidal");
    }

    pub fn is_running(&self) -> bool {
        return self.is_running;
    }

    pub fn start(&mut self, window: Window, boot_tidal_path: String) {

        let stream_clone = self.stream.clone();
        let sink_clone = self.sink.clone();

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
            match event {
              CommandEvent::Stdout(line) => {
                println!("t> {}", line);
                window.emit("log", LogPayload { message: line, level: "info".to_string() })
                  .expect("Error emitting the log event");
              },
              CommandEvent::Stderr(line) => {
                println!("te> {}", line);
                window.emit("log", LogPayload { message: line, level: "error".to_string() })
                  .expect("Error emitting the log event");
              },
              CommandEvent::Error(line) => {
                println!("ERROR {}", line);
                window.emit("log", LogPayload { message: line, level: "fatal".to_string() })
                  .expect("Error emitting the log event");
              },
              _ => {

              }
            }
          }
        });


        sink_clone.send(format!(":script {}", boot_tidal_path)).expect("Error initializing tidal");

        self.is_running = true;
    }
}