#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::io::Read;
use std::process::{Command,Stdio};
use std::thread;

#[tauri::command]
fn tidal_ghci_start() {
  println!("Will run ghci");

  let mut ghci = Command::new("ghci")
    .spawn()
    .expect("failed to execute process");

  let mut child_stdout = ghci.stdout.take().unwrap();
  // let mut child_stderr = ghci.stderr.take().unwrap();
  
  thread::spawn(move || {
      let mut buf = String::new();
      match child_stdout.read_to_string(&mut buf) {
        Err(err) => {
          println!("{}] Error reading from stream: {}", line!(), err);
        }
        Ok(line) => {
            println!("ciao mare! {}", line)
        }
      }
  });

}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![tidal_ghci_start])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
