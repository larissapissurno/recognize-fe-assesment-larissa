class RecognitionsController < ApplicationController
  before_action :require_login

  def index
    @recognitions = Recognition.includes(:badge, :sender, :recipient).order(created_at: :desc)
    @recognition = Recognition.new
    @badges = Badge.order(:name)
    @users = User.order(:name)
  end

  def create
    @recognition = Recognition.new(recognition_params)
    @recognition.sender = current_user
    if @recognition.save
      redirect_to root_path, notice: "Recognition sent"
    else
      @recognitions = Recognition.includes(:badge, :sender, :recipient).order(created_at: :desc)
      @badges = Badge.order(:name)
      @users = User.order(:name)
      flash.now[:alert] = "Could not send recognition"
      render :index, status: :unprocessable_entity
    end
  end

  private

  def recognition_params
    params.require(:recognition).permit(:recipient_id, :badge_id, :message)
  end
end
