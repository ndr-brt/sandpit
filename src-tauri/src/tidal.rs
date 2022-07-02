use crossbeam_channel::{unbounded, Sender, Receiver};
use std::thread;
use tauri::api::process::{Command, CommandEvent};

pub struct Tidal {
    isRunning: bool,
    sink: Sender<String>,
    stream: Receiver<String>
}

impl Tidal {
    pub fn new() -> Tidal {
        let (ghci_sink, ghci_stream) = unbounded::<String>();

        let stream_clone = ghci_stream.clone();

        tauri::async_runtime::spawn(async move {
          let (mut rx, mut child) = Command::new("ghci")
            .spawn()
            .expect("Failed to spawn ghci");
        
          thread::spawn(move || {
            loop {
              if let Ok(line) = ghci_stream.try_recv() {
                child.write((line + "\n").as_bytes());
              }
            }
          });
      
          while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
              println!("t> {}", line);
            }
          }
        });

        return Tidal { isRunning: false, sink: ghci_sink, stream: stream_clone };
    }

    pub fn sendLine(&self, line: String) {
        println!("==> {}", line);
        self.sink.send((line + "\n").to_string());
    }
}