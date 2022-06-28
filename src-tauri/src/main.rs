#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// use std::io::Read;
// use std::process::{Command,Stdio};
// use std::thread;
// use std::thread::sleep;
// use std::time::Duration;
use std::thread;
use crossbeam_channel::{unbounded, Sender};
use tauri::api::process::{Command, CommandEvent};

struct MyState(Sender<String>);

#[tauri::command]
fn tidal_ghci_start(state: tauri::State<MyState>) {
  println!("Will send stuff to ghci.");
  state.0.send("import Sound.Tidal.Context\n".to_string());
  state.0.send("tidal_version\n".to_string());

  

  // let ghci = Command::new("ghci")
  //   .spawn()
  //   .expect("failed to execute ghci");

  // sleep(Duration::from_secs(5));
  // match ghci.stdout {
  //   None => {}
  //   Some(mut stdout) => {
  //     thread::spawn(move || {
  //       // let mut buf = String::new();
  //       // match stdout.read_to_string(&mut buf) {
  //       //   Err(err) => {
  //       //     // println!("{}] Error reading from stream: {}", line!(), err);
  //       //   }
  //       //   Ok(line) => {
  //       //       // println!("{}", line)
  //       //   }
  //       // }
  //   });
  //   }
  // }

}


fn main() {
  let (tidal_sink, tidal_stream) = unbounded::<String>();
  let (ghci_sink, ghci_stream) = unbounded::<String>();

  tauri::async_runtime::spawn(async move {
    let (mut rx, mut child) = Command::new("ghci")
      .spawn()
      .expect("Failed to spawn ghci");
  
    thread::spawn(move || {
      loop {
        if let Ok(line) = ghci_stream.try_recv() {
          println!("received stuff to send to the process {}", line);
          child.write(line.as_bytes());
        }
      }
    });

    let mut i = 0;
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        println!("got: {}", line);
        i += 1;
        if i == 4 {
          // ghci_sink.send("message from Ghci\n".to_string());
          i = 0;
        }
      }
    }
  });

  let context = tauri::generate_context!();
  tauri::Builder::default()
    .manage(MyState(ghci_sink))
    .invoke_handler(tauri::generate_handler![tidal_ghci_start])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
