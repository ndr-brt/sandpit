#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod tidal;

use std::sync::Mutex;
use crate::tidal::Tidal;

struct MyState(Mutex<Tidal>);

#[tauri::command]
fn tidal_ghci_start(state: tauri::State<MyState>) {
  println!("Will send stuff to ghci.");
  let mut tidal = state.0.lock().unwrap();
  if !tidal.is_running() {
    tidal.start("/home/andrea/Code/livecoding/sc-adente/BootTidal.hs".to_string())
  }
  tidal.send_line("tidal_version".to_string());
}


fn main() {
  let tidal = Tidal::new();

  let context = tauri::generate_context!();
  tauri::Builder::default()
    .manage(MyState(Mutex::new(tidal)))
    .invoke_handler(tauri::generate_handler![tidal_ghci_start])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
