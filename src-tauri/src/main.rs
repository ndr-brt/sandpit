#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod tidal;


use crate::tidal::Tidal;

struct MyState(Tidal);

#[tauri::command]
fn tidal_ghci_start(state: tauri::State<MyState>) {
  println!("Will send stuff to ghci.");
  state.0.sendLine("import Sound.Tidal.Context".to_string());
  state.0.sendLine("tidal_version".to_string());
}


fn main() {
  let tidal = Tidal::new();

  let context = tauri::generate_context!();
  tauri::Builder::default()
    .manage(MyState(tidal))
    .invoke_handler(tauri::generate_handler![tidal_ghci_start])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
